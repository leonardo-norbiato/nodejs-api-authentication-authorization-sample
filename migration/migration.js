'use strict';
const { Role } = require("../models/role.model");
const { User } = require("../models/user.model");
const util = require('../util/index');
const config = require('config');
const mongoose = require('mongoose');
const users = require('./data/users.json');
const roles = require('./data/roles.json');
const bcrypt = require("bcrypt");

const cleanUsers = async () => {
    await User.deleteMany({});
}

const cleanRoles = async () => {
    await Role.deleteMany({});
}

const createRole = async (role) => {
    let _role = new Role(role);
    await _role.save();
}

const createUser = async (user) => {
    let _user = new User(user);
    _user.password = await bcrypt.hash(user.password, 10);
    await _user.save();
}

(async () => {
    let role = null;
    let mongo = config.get("mongo");
    await util.OpenConnection(mongo.server, mongo.database, mongo.user, mongo.pass);

    if (roles.length > 0) {
        await cleanRoles();
        for (let _role of roles) {
            await createRole(_role);
        }
    }
    if (users.length > 0) {
        await cleanUsers();
        for (let user of users) {
            await createUser(user);
        }
    }
    process.exit();
})();