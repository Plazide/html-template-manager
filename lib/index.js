const fs = require("fs");
const path = require("path");

function showPaths(){
	let options = "";

	try{
		// This should work when running the command locally through npm.
		options = fs.readFileSync("../data/config.json", "utf8");
	}catch(err){
		// This should work when running the command globally.
		if(err.code === "ENOENT")
			options = fs.readFileSync(path.join(__dirname, "../", "data", "config.json"));
	}

	options = JSON.parse(options);
	const template_file = options.template_file;
	const static_folder = options.static_folder;
	
	console.log();
	console.log("Template file:", template_file);
	console.log("Static folder:", static_folder);
	console.log();
}

function templateWatch(template, static){
	fs.watch(template, {encoding: "utf8"}, (type) => {
		if(type === "change"){
			updateFilesFromTemplate(template, static);
		}		
	});
}

function staticWatch(static, template){
	fs.watch(static, {encoding: "utf8"}, (type, filename) => {
		if(type === "rename"){
			simpleOverwrite(static+"/"+filename, template);
		}
			
	});
}

function listen(template, static, flags){

	if(flags.indexOf("--once") !== -1){
		updateFilesFromTemplate(template, static)
		return;
	}

	if(flags.indexOf("--paths") !== -1){
		showPaths();
		return;
	}
		
	try{
		console.log("Template file:", template);
		console.log("Static folder:", static);
		templateWatch(template, static);
	}catch(err){
		if(err.code === "ENOENT"){
			const dir = path.dirname(template);
			const name = path.basename(template);
			const html = fs.readFileSync(path.join(__dirname, "../", "default", "default.html"), "utf8");

			fs.mkdirSync(dir, {recursive: true});
			fs.writeFileSync(path.join(dir, name), html);

			templateWatch(template, static);
		}
	}
		

	try{
		staticWatch(static, template);
	}catch(err){
		if(err.code === "ENOENT"){
			const dir = static;

			fs.mkdirSync(dir);

			staticWatch(static, template);
		}
	}
		
}	

function simpleOverwrite(file, template){
	const html = fs.readFileSync(template, "utf8");

	fs.writeFileSync(file, html);
}

function getExt(file){
	return path.extname(file);
}

function updateFilesFromTemplate(path, static){
	//console.log("Template path:", path);

	const dir = static;
	const template = fs.readFileSync(path, "utf8");
	const files = fs.readdirSync(dir);
	//console.log("Template content:", template.split("").length);

	for(let file of files){
		const ext = getExt(file);

		if(ext === ".html")
			updateFile(`${dir}\\${file}`, template);
	}
}

function findEditable(file, endTag, re){
	const html = fs.readFileSync(file, "utf8");
	const results = [];
	const declarationTag = new RegExp("<!-- TemplateFile -->");
	const isEditable = declarationTag.test(html);

	if(isEditable){
		while(re.exec(html)){
			const start = re.lastIndex;
			const end = html.indexOf(endTag, start);
			const content = html.slice(start, end);

			results.push(content);
		}
	}

	return results;
}

function updateFile(file, template){
	const startTag = "<!-- BeginEditable -->";
	const endTag = "<!-- EndEditable -->";
	const re = new RegExp(startTag, "g");
	const editables = findEditable(file, endTag, re);
	let updatedFile = template;
	let i = 0;

	if(editables.length > 0){
		while(re.exec(updatedFile)){
			const start = re.lastIndex;
			const end = updatedFile.indexOf(endTag, start);

			// Add in the editable content and trim the content around it to avoid unnecessary whitespace.
			updatedFile = updatedFile.slice(0, start).trim() + editables[i] + updatedFile.slice(end).trim();

			i++;
		}

		if(i === editables.length){
			fs.writeFile(file, updatedFile, (err) => {
				if(err) throw err;

				console.log("Applied template to "+file);
			});
			
		}
			
	}
}

module.exports = {
	listen
}