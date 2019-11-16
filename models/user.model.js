const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const userPolicy = new mongoose.Schema({
    product: {
        type: String,
        default: undefined,
        required: false,
    },
    aplication: {
        type: String,
        required: false,
    },
    roles:{
        type: Array,
        required: false,
        default: undefined
    }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    rbac: [userPolicy],
    isAdmin: Boolean
});

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, exp: Math.floor(Date.now() / 1000) + (60*60), rbac: this.rbac }, config.get('secret'));
    return token;
}

const User = mongoose.model('User', UserSchema);

function validateUser(user) {
    const schema = {
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateLogin(user) {
    const schema = {
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(3).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateUserRole(user) {
    const schema = {
        id: Joi.string().required(),
        rbac: Joi.array().required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateUserRole = validateUserRole;
exports.validateLogin = validateLogin;