#!/usr/bin/env node

const fs = require("fs");
const path = require("path")
const script = require("../lib/index");
const config = require("../data/config.json");
const {flagExists} = require("../lib/helper");
const flags = require("../data/flags");
const args = process.argv;
const existingFlags = flags.filter(flag => flagExists(args, flag));
const cwd = process.cwd();

let template = (args[2] in flags) ? args[2] : null;
let static = (args[3] in flags) ? args[3] : null;

//console.log(existingFlags);

if(template || static){
	// If template or static arguments are passed to the cli,
	// set the config values to the passed values and save the new config.
	config.static_folder = static;
	config.template_file = template;

	// Set the base directory to the current working directory.
	template = `${cwd}\\${template}`;
	static = `${cwd}\\${static}`;

	fs.writeFileSync(path.join(__dirname, "../", "data", "config.json"), JSON.stringify(config));
}else{
	// Set the base directory to the current working directory.
	template = `${cwd}\\${config.template_file}`;
	static = `${cwd}\\${config.static_folder}`;
}

script.listen(template, static, existingFlags);