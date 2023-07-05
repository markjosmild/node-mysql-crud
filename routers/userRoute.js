const router = require("express").Router();
const connection = require("../database/database");
const bcrypt = require("bcrypt");

router.get("/test", (req, res) => {
  res.json("path ok");
});

router.post("/register", async (req, res) => {
  const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const values = [[req.body.username, req.body.email, req.body.password]];
  connection.query(q, values, (err) => {
    if (err) return res.json(err);
    return res.json(req.body);
  });
});

router.post("/login", async (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  connection.query(q, [req.body.username], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(500).json("User not found");
    const user = result[0];
    const passwordTrue = await bcrypt.compare(req.body.password, user.password);
    if (!passwordTrue) return res.status(500).json("Password does not match");
    const { password, ...others } = user;
    res.json(others);
  });
});

router.get("/", async (req, res) => {
  const q = "SELECT * FROM users";
  connection.query(q, async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(500).json("No users found");
    const users = result;
    //const { password, ...others } = user;
    res.json(users);
  });
});

router.get("/:id", async (req, res) => {
  const q = "SELECT * FROM users WHERE id = ?";
  connection.query(q, [req.params.id], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(500).json("User not found");
    const user = result[0];
    const { password, ...others } = user;
    res.json(others);
  });
});

router.delete("/:id", async (req, res) => {
  const q = "DELETE FROM users WHERE id = ?";
  connection.query(q, [req.params.id], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(500).json("User not found");
    res.json("User has been deleted successfully");
  });
});

router.put("/:id", async (req, res) => {
  if (req.body.password)
    req.body.password = await bcrypt.hash(req.body.password, 10);
  const { id } = req.params;
  const { username, email, password } = req.body;
  const q =
    "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
  const values = [username, email, password, id];
  connection.query(q, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json("User has been updated successfully");
  });
});

module.exports = router;
