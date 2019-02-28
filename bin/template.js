#!/usr/bin/env node
const templates = require("../lib/index");
const args = process.argv;
const template = args[2];
const static = args[3];

templates.listen(template, static);

console.log(args);