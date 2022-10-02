#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

const currentPath = process.cwd();
const pagePath = process.argv[2];
const viewsPath = path.join(currentPath, "app/views");

console.log(currentPath, pagePath, viewsPath);
if (process.argv.length < 3) {
  console.log("\x1b[31m");
  console.log("Please provide path of the page you want to add");
  console.log(
    "All pages must reside under ./app/views folder hence path must be relative to the ./app/views folder"
  );
  console.log("For example :");
  console.log("    npm run add-page /v1/my-new-page.html");
  console.log("\x1b[0m");
  process.exit(1);
}

(async function () {
  console.log("\x1b[33m");
  console.log(`Creating new page ${pagePath}`, "\x1b[0m");

  if (fs.existsSync(path.join(viewsPath, pagePath))) {
    console.log("\x1b[31m");
    console.log(
      `Page ./app/views/${pagePath} already exists. Please use different name or path`
    );
    console.log("\x1b[0m");
    process.exit(1);
  }

  const pageParentDirPath = path.join(
    viewsPath,
    pagePath.substring(0, pagePath.lastIndexOf("/"))
  );
  const pageParentDirExists = fs.existsSync(pageParentDirPath);
  console.log(pageParentDirPath, pageParentDirExists);

  if (!pageParentDirExists) {
    fs.mkdirSync(pageParentDirPath);
  }

  fs.writeFileSync(
    path.join(viewsPath, pagePath),
    fs.readFileSync("./scripts/templates/new-page.html", "utf8"),
    "utf8"
  );

  console.log("\x1b[32m");
  console.log(
    `Page added successfully, the new page is available at http://localhost:3000${
      pagePath.startsWith("/") ? pagePath : "/" + pagePath
    }`,
    "\x1b[0m"
  );
})();
