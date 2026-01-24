const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  console.log('Signup attempt for username:', req.body.username);
  try {
    // Validate input
    if (!req.body.username || !req.body.email || !req.body.password) {
      console.log('Input validation failed: missing fields');
      return res.status(400).send({ message: "Username, email, and password are required!" });
    }
    console.log('Input validation passed');

    // Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { username: req.body.username }
        ]
      }
    });
    if (existingUser) {
      console.log('Existing user found:', existingUser.username);
      return res.status(400).send({ message: "User with this email or username already exists!" });
    }
    console.log('No existing user found');

    // Hash password asynchronously
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    console.log('Password hashed');

    // Create user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    console.log('User created with ID:', user.id);

    // Assign roles
    if (req.body.roles && Array.isArray(req.body.roles)) {
      console.log('Assigning custom roles:', req.body.roles);
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      });
      if (roles.length !== req.body.roles.length) {
        console.log('Invalid roles provided');
        return res.status(400).send({ message: "One or more roles are invalid!" });
      }
      await user.setRoles(roles);
      console.log('Custom roles assigned');
    } else {
      // Default role
      console.log('Assigning default role');
      await user.setRoles([1]);
      console.log('Default role assigned');
    }

    console.log('Signup successful for user:', user.username);
    res.send({ message: "User registered successfully!" });
  } catch (err) {
    console.log('Error during signup:', err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  console.log('Refresh token attempt for token:', req.body.refreshToken ? 'provided' : 'missing');
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    console.log('Refresh token missing');
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
    console.log('Refresh token found in DB:', !!refreshToken);

    if (!refreshToken) {
      console.log('Refresh token not in database');
      return res.status(403).json({ message: "Refresh token is not in database!" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      console.log('Refresh token expired, destroying');
      await RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }

    console.log('Refresh token valid, getting user');
    const user = await refreshToken.getUser();
    console.log('User retrieved:', user.id);
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    console.log('New access token generated');
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.error('Error in refresh token:', err.message);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};