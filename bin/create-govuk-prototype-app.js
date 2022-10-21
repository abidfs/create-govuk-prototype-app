#!/usr/bin/env node

"use strict";

const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");

const {
  buildPackageJson,
  generateProjectFromGovukTemplate,
  checkProjectExists,
} = require("./scripts/utils");
const configureMojFrontend = require("./scripts/moj");
const configureDwpFrontend = require("./scripts/dwp");

const packageJson = require("../package.json");

const currentPath = process.cwd();
const gitRepo = "https://github.com/abidfs/create-govuk-prototype-app.git";

inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: "What you would like to do today",
      choices: [
        "Create a prototype from scratch",
        "Add template to existing prototype",
      ],
    },
  ])
  .then(async (answers) => {
    if (answers.action === "Create a prototype from scratch") {
      inquirer
        .prompt([
          {
            name: "projectName",
            message: "Project name?",
            default: "my-prototype",
          },
          {
            type: "checkbox",
            name: "templates",
            message: "Select template",
            default: ["Default (Govuk frontend)"],
            choices: [
              "Default (Govuk frontend)",
              "MOJ Frontend",
              "DWP Frontend",
            ],
          },
        ])
        .then(async ({ projectName, templates }) => {
          const projectPath = path.join(currentPath, projectName);

          checkProjectExists(projectPath);

          try {
            await generateProjectFromGovukTemplate(gitRepo, projectPath);

            buildPackageJson(packageJson, projectName);

            if (templates.includes("MOJ Frontend")) {
              await configureMojFrontend(projectPath);
            }

            if (templates.includes("DWP Frontend")) {
              await configureDwpFrontend(projectPath);
            }

            console.log("\x1b[32m");
            console.log(
              "The installation is complete, prototype is ready to use !",
              "\x1b[0m"
            );

            console.log(
              "\x1b[34m",
              "You can start the prototype app by typing:"
            );
            console.log(`    cd ${projectName}`);
            console.log("    npm start", "\x1b[0m");
            console.log();
            console.log("Check Readme.md for more information");
            console.log();
          } catch (error) {
            console.log(error);
          }
        });
    } else {
      inquirer
        .prompt([
          {
            type: "checkbox",
            name: "templates",
            message: "Which templates you would like to add?",
            choices: [
              "MOJ Frontend",
              "DWP Frontend",
              "HMRC Frontend",
              "HMCTS Frontend",
            ],
          },
        ])
        .then(async (answers) => {
          if (answers.templates.includes("MOJ Frontend")) {
            const projectPath = process.cwd();
            configureMojFrontend(projectPath);
          }

          if (answers.templates.includes("DWP Frontend")) {
            const projectPath = process.cwd();
            configureDwpFrontend(projectPath);
          }
        });
    }
  });
