#!/usr/bin/env node

"use strict";

const path = require("path");
const util = require("util");
const packageJson = require("../package.json");
const fs = require("fs");
const exec = util.promisify(require("child_process").exec);

async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log("\x1b[31m");
      console.log(error);
      console.log("\x1b[0m");
    };
  }
}

if (process.argv.length < 3) {
  console.log("\x1b[31m");
  console.log("Please provide a name to your app.");
  console.log("For example :");
  console.log("    npx create-govuk-prototype-app my-prototype");
  console.log("\x1b[0m");
  process.exit(1);
}

const currentPath = process.cwd();
const projectName = process.argv[2];
const projectPath = path.join(currentPath, projectName);
const gitRepo = "https://github.com/abidfs/create-govuk-prototype-app.git";

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === "EEXIST") {
    console.log(
      "\x1b[31m",
      `Project ${projectName} already exist in the current directory, please use a different name.`,
      "\x1b[0m"
    );
  } else {
    console.log("\x1b[31m");
    console.log(error);
    console.log("\x1b[0m");
  }
  process.exit(1);
}

function buildPackageJson(packageJson, projectName) {
  const { bin, keywords, license, homepage, repository, bugs, ...newPackage } =
    packageJson;

  Object.assign(newPackage, {
    name: projectName,
    version: "1.0.0",
    description: "",
    author: "",
  });

  fs.writeFileSync(
    `${process.cwd()}/package.json`,
    JSON.stringify(newPackage, null, 2),
    "utf8"
  );
}

(async function () {
  try {
    console.log("\x1b[33m");
    console.log("Downloading files...", "\x1b[0m");
    await runCmd(`git clone --depth 1 ${gitRepo} ${projectPath}`);
    console.log();

    process.chdir(projectPath);

    console.log("\x1b[34m");
    console.log("Installing dependencies...", "\x1b[0m");
    await runCmd("npm install");

    console.log("\x1b[34m");
    console.log("Removing useless files", "\x1b[0m");
    await runCmd("npx rimraf ./.git");
    fs.rmSync(path.join(projectPath, "bin"), { recursive: true });
    fs.unlinkSync(path.join(projectPath, "package.json"));

    buildPackageJson(packageJson, projectName);

    console.log("\x1b[32m");
    console.log(
      "The installation is complete, prototype is ready to use !",
      "\x1b[0m"
    );

    console.log("\x1b[34m", "You can start the prototype app by typing:");
    console.log(`    cd ${projectName}`);
    console.log("    npm start", "\x1b[0m");
    console.log();
    console.log("Check Readme.md for more information");
    console.log();
  } catch (error) {
    console.log(error);
  }
})();
