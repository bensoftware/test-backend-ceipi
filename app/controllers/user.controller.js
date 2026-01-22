exports.allAccess = (req, res) => {
  res.status(200).send("Public Content info.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Manager or Moderator Content.");
};
