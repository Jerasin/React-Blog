// Import Config File Env
const dotenv = require("dotenv");
dotenv.config();

module.exports = require("./env/" + process.env.ENV_DEV + ".js")