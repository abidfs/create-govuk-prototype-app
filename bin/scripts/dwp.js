const fs = require("fs");
const path = require("path");
const {runCmd} = require('./utils');

async function configureDwpFrontend(projectPath) {
    console.log("\x1b[34m");
    console.log("Configuring DWP frontend...", "\x1b[0m");
    await runCmd("npm install @dwp/dwp-frontend --save");
  }

  module.exports = configureDwpFrontend;