const auth = require("../middleware/auth");
const service = require('../services/role.service');
const util = require("../util/token");
const bcrypt = require("bcrypt");
const { User, validateUser, validateLogin, validateUserRole } = require("../models/user.model");
const express = require("express");
const router = express.Router();
const config = require('config')

router.get("/current", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');;
    res.send(user);
  } catch (error) {
    return res.status(500).send(`ERRO:${error.message}`);
  }
});

function normalizeRBAC(rbac) {
  let roles = rbac.filter(p => p.product == config.get("product"));
  if (roles) {
    roles = roles.map(r => r.roles);
  }
  return roles;
}

router.get("/menu/:atrributes", auth, async (req, res) => {
  try {

    const _service = new service();
    await _service.setRole();

    let roles = normalizeRBAC(req.user.rbac); // todas as funções do usuário
    let resurce = req.path.replace('/', '').split('/').shift(); // nome do recurso (neste caso o nome da api) 
    let action = "read"; // ação
    let context = JSON.parse(req.headers['x-api-context']); //aplicacao do cliente
    let atrributes = [req.params.atrributes]; // nivel do menu

    let _grant = await _service.grant(roles, action, context, resurce, atrributes);
    if (_grant) {
      res.send('SUCESSO- Tem Permissão');
    } else {
      return res.status(401).send('ERRO:Sem Menu para este usuário');
    }
  } catch (error) {
    return res.status(500).send(`ERRO:${error.message}`);
  }

});

router.post("/roles", async (req, res) => {
  try {
    const { error } = validateUserRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findById(req.body.id);
    if (!user) return res.status(400).send("Usuário não reconhecido registrado.");
    user.rbac = req.body.rbac
    await user.save();
    return res.send({
      name: user.name,
      email: user.email
    });
  } catch (error) {
    return res.status(500).send(`ERRO:${error.message}`);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Usuário já registrado.");
    user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    return util.gerarToken(user, res);
  } catch (error) {
    return res.status(500).send(`ERRO:${error.message}`);
  }
});

module.exports = router;