const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync().then(() => {
  console.log('Database synced successfully.');
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ben judicaelle application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/expense.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.findOrCreate({
    where: { id: 1 },
    defaults: { name: "user" }
  });

  Role.findOrCreate({
    where: { id: 2 },
    defaults: { name: "moderator" }
  });

  Role.findOrCreate({
    where: { id: 3 },
    defaults: { name: "admin" }
  });
}