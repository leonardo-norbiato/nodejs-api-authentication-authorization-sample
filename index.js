const config = require("config");
const mongoose = require("mongoose");
const util = require("./util/index");
const routes = require("./routes/index");
const express = require("express");
const app = express();

const validateStart = () => {
    let _isvalide = true;
    if (!config.has("secret")) {
        console.error("FATAL ERROR: secret não definido.");
        _isvalide = false;
    }
    if (!config.has("mongo")) {
        console.error("FATAL ERROR: mongo não definido.");
        _isvalide = false;
    }
    if (!config.has("product")) {
        console.error("FATAL ERROR: product não definido.");
        _isvalide = false;
    }
    _isvalide ? _isvalide : process.exit(1);
}

function main(validate) {
    validate();
    let mongo = config.get("mongo");
    util.OpenConnection(mongo.server, mongo.database, mongo.user, mongo.pass);
    app.use(express.json());
    //use users route for api/users
    app.use("/api", routes);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main(validateStart);