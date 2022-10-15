const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function checkProjectExists(projectPath) {
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
      console.log(err);
      console.log("\x1b[0m");
    }
    process.exit(1);
  }
}

async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(stderr);
    }
  } catch {
    (error) => {
      console.log("\x1b[31m");
      console.log(error);
      console.log("\x1b[0m");
    };
  }
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

async function generateProjectFromGovukTemplate(gitRepo, projectPath) {
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
}

module.exports = {
  checkProjectExists,
  runCmd,
  generateProjectFromGovukTemplate,
  buildPackageJson,
};
