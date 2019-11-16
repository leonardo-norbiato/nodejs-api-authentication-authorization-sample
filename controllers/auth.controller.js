//const auth = require("../middleware/auth");
const util = require("../util/token");
const bcrypt = require("bcrypt");
const { User, validateUser, validateLogin } = require("../models/user.model");
const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ username: req.body.username });
    return await bcrypt.compare(req.body.password, user.password) ? util.gerarToken(user, res) : res.status(400).send('falha de login');
});

module.exports = router;