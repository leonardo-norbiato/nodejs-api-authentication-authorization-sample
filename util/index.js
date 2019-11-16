const mongoose = require("mongoose");

const OpenConnection = (server, database, user, pass) => {
    let constring = (user && pass ? `${user}:${pass}@` : '') + `${server}/${database}`;
    mongoose
        .connect(`mongodb://${constring}`, { useNewUrlParser: true })
        .then(() => console.log("Conectado no MongoDB..."))
        .catch(err => console.error("Não foi possivel conectar no MongoDB..."));
}
exports.OpenConnection = OpenConnection;