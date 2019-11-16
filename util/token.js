const jwt = require("jsonwebtoken");

const gerarToken = (user, res) => {
    let token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
        name: user.name,
        email: user.email
    });
}
exports.gerarToken = gerarToken;