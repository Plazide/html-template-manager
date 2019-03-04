#!/usr/bin/env node

const fs = require("fs");
const script = require("../lib/index");
const config = require("../data/config.json");
const args = process.argv;
let template = args[2];
let static = args[3];

if(template || static){
	// If template or static arguments are passed to the cli,
	// set the config values to the passed values and save the new config.
	config.static_folder = static;
	config.template_file = template;

	fs.writeFileSync(JSON.stringify(config), "../data/config.json");
}else{
	static = config.static_folder;
	template = config.template_file;
}

script.listen(template, static);