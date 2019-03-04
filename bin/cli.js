#!/usr/bin/env node

const fs = require("fs");
const path = require("path")
const script = require("../lib/index");
const config = require("../data/config.json");
const args = process.argv;
const flag = "--once";
const once = flagExists(args, flag);
let template = args[2] !== flag ? args[2] : null;
let static = args[3] !== flag ? args[3] : null;

function flagExists(args){
	let result = false;

	for(let arg of args){
		if(arg === flag){
			result = true;
		}
	}

	return result;
}

if(template || static){
	// If template or static arguments are passed to the cli,
	// set the config values to the passed values and save the new config.
	config.static_folder = static;
	config.template_file = template;

	fs.writeFileSync(path.join(__dirname, "data", "config.json"), JSON.stringify(config));
}else{
	static = config.static_folder;
	template = config.template_file;
}

script.listen(template, static, once);