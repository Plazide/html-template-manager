const { exec } = require("child_process");
const path = require("path");
const dir = path.join(__dirname, "../");

console.log("Linking", dir);

exec(`cd ${dir}`);
exec("npm link");