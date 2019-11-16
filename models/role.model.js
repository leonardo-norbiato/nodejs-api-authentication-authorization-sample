const Joi = require('joi');
const mongoose = require('mongoose');

const RoleSchemma = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    resource: {
        type: String,
        default: undefined,
        required: false,
    },
    action: {
        type: String,
        default: undefined,
        required: false,
    },
    attributes: {
        type: Array,
        default: undefined,
        required: false,
    },
    condition: {
        Fn: {
            type: String,
            default: undefined,
            required: false,
        },
        args: {
            type: Map,
            default: undefined,
            required: false,
        }
    },
    isActive: Boolean
});

const Role = mongoose.model('Role', RoleSchemma);

function validateRole(user) {
    /*const schema = {
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
        rbac: Joi.array(),
    };
    return Joi.validate(user, schema);
    */
    return true;
}

exports.Role = Role;
exports.validateRole = validateRole;
