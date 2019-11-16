'use strict';
const { Role, validateRole } = require("../models/role.model");
const AccessControl = require('role-acl');
const ac = new AccessControl();

module.exports = class RoleService {
    constructor(grants) {
        //     this.setRole(grants);
    }

    async setRole(grants) {
        try {
            let roles = await Role.find({}).exec();
            if (grants) {
                roles = grants;
            }
            if (roles) {
                let _roles = [];

                for (let item of roles) {
                    let t = {
                        role: item.role,
                        resource: item.resource,
                        action: item.action,
                        attributes: [],
                        condition: { }
                    };

                    for (const val of item.attributes.values()) {
                        t.attributes.push(val);
                    }
                    let Fn = item.condition.Fn;
                    let args = {}
                    for (const key of item.condition.args.keys()) {
                        args[key] = item.condition.args.get(key);
                    }
                    t.condition = {Fn:Fn, args:args};

                    _roles.push(t);
                    //console.log(t)
                }

                this.ac = new AccessControl(_roles);
            }
        } catch (e) {
            console.log('Deu Ruim')
        }
    };

    async getRoleById(id) {
        let role = await Role.findById(id);
        return role;
    }

    async getAllRoles() {
        let roles = await Role.find();
        return roles;
    }

    async getRoleByName(_name) {
        let role = await Role.findOne({ name: _name, isActive: true });
        return role;
    }

    async grant(_role, _execute, _context, _on, _attrib) {
        let roles = [..._role];
        let retorno = { granted: false };
        for (let role of roles) {
            if (!retorno.granted) {
                try {
                    retorno = await this.ac.can(role[0].toString()).execute(_execute).context(_context).on(_on);
                    if (retorno.granted == true){ 
                        let attrib = retorno.attributes.filter(f => _attrib.includes(f));
                        if (attrib.length == 0){
                            retorno = { granted: false };
                        }
                        
                    }
                } catch (e) {
                    retorno = { granted: false };
                }
            }
        }
        return retorno.granted;
    }
}