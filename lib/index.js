const fs = require("fs");
const path = require("path");
const { now } = require("./helper");

const updates = {
	"template": now(),
	"static": now()
};

function showPaths(){
	const options = fs.readFileSync("../data/config.json", "utf8");

	console.log(JSON.parse(options));
}

function templateWatch(template, static){
	fs.watch(template, {encoding: "utf8"}, (type) => {
		const ctime = now();
		const timeDiff = ctime - updates.template;

		if(type === "change" && timeDiff > 100){
			updateFilesFromTemplate(template, static);
			updates.template = ctime;
		}		
	});
}

function staticWatch(static, template){
	fs.watch(static, {encoding: "utf8"}, (type, filename) => {
		const ctime = now();
		const timeDiff = ctime - updates.static;

		if(type === "rename" && timeDiff > 100){
			simpleOverwrite(static+"/"+filename, template);
			updates.static = ctime;
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
	console.log("Template path:", path);

	const dir = static;
	const template = fs.readFileSync(path, "utf8");
	const files = fs.readdirSync(dir);

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

	console.log("Template content:", template);

	if(editables.length > 0){
		while(re.exec(updatedFile)){
			const start = re.lastIndex;
			const end = updatedFile.indexOf(endTag, start);

			// Add in the editable content and trim the content around it to avoid unnecessary whitespace.
			updatedFile = updatedFile.slice(0, start).trim() + editables[i] + updatedFile.slice(end).trim();

			i++;
		}

		if(i === editables.length){
			fs.writeFileSync(file, updatedFile);
			console.log("Applied template to "+file);
		}
			
	}
}

module.exports = {
	listen
}