const fs = require("fs");
const path = require("path");
const {runCmd} = require('./utils');

async function configureMojFrontend(projectPath) {
    console.log("\x1b[34m");
    console.log("Configuring MOJ frontend...", "\x1b[0m");
    await runCmd("npm install jquery @ministryofjustice/frontend --save");
    await runCmd(`cp -r ${path.join(projectPath, "/node_modules/@ministryofjustice/frontend/moj/assets")} ${path.join(projectPath, "app/assets/moj")}`)
    await runCmd(`cp -r ${path.join(projectPath, "/node_modules/@ministryofjustice/frontend/moj/all.js")} ${path.join(projectPath, "app/assets/moj/all.js")}`)
    fs.appendFileSync(
      path.join(projectPath, "app/assets/sass/application.scss"),
      `
  // Include moj frontend assets from the path /app/assets/moj
  $moj-assets-path: "/app/assets/moj";
  @import "node_modules/@ministryofjustice/frontend/moj/all";
      `
    );
  
    fs.appendFileSync(
      path.join(projectPath, "app/views/includes/scripts.html"),
      `
  <script src="/public/moj/all.js"></script>
      `
    );
  
    fs.appendFileSync(
      path.join(projectPath, "app/assets/javascripts/application.js"),
      `
  $(document).ready(function () {
    window.MOJFrontend.initAll()
  })
      `
    );
  }

  module.exports = configureMojFrontend;