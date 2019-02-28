#!/usr/bin/env node
const templates = require("../lib/index");
const args = process.argv;
const template = args[2];
const static = args[3];

if(!template || !static)
	throw new Error("Missing arguments");

templates.listen(template, static);