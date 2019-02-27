const fs = require("fs");
const static = "static";

fs.watch("./templates", {encoding: "utf8"}, (type, filename) => {
	if(type === "change")
		updateFilesFromTemplate("./templates/"+filename);

});

fs.watch("./"+static, {encoding: "utf8"}, (type, filename) => {
	if(type === "rename")
		simpleOverwrite(filename, "./templates/template.html");
});

function simpleOverwrite(file, template){
	const html = fs.readFileSync(template, "utf8");

	fs.writeFileSync(`./static/${file}`, html);
}

function getExt(file){
	return file.split(".").slice(-1)[0];
}

function updateFilesFromTemplate(path){
	const dir = static;
	const template = fs.readFileSync(path, "utf8");
	const files = fs.readdirSync(dir);

	for(let file of files){
		const ext = getExt(file);

		if(ext === "html")
			updateFile(`./${dir}/${file}`, template);
	}
}

function findEditable(file, endTag, re){
	const html = fs.readFileSync(file, "utf8");
	const results = [];

	while(re.exec(html)){
		const start = re.lastIndex;
		const end = html.indexOf(endTag, start);
		const content = html.slice(start, end);

		
		results.push(content);
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

	while(re.exec(updatedFile)){
		const start = re.lastIndex;
		const end = updatedFile.indexOf(endTag, start);

		// Add in the editable content and trim the content around it to avoid unnecessary whitespace.
		updatedFile = updatedFile.slice(0, start).trim() + editables[i] + updatedFile.slice(end).trim();

		i++;
	}

	
	if(i === editables.length)
		fs.writeFileSync(file, updatedFile);
}