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
	const watcher = fs.watch(template, {encoding: "utf8"}, (type) => {
		if(type === "change"){
			updateFilesFromTemplate(template, static);
		}		
	});

	watcher.on("error", err => {
		console.log(err);
	});
}

function staticWatch(static, template){
	const watcher = fs.watch(static, {encoding: "utf8"}, (type, filename) => {
		if(type === "rename"){
			simpleOverwrite(static+"/"+filename, template);
		}
			
	});

	watcher.on("error", err => {
		if(err.code === "EPERM")
			console.error("Error watching", static);
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
	const ext = getExt(file);
	if(ext !== ".html") return;

	const html = fs.readFileSync(template, "utf8");
	const instance = {
		startComment: "<!-- InstanceBegin -->",
		endComment: "<!-- InstanceEnd -->"
	}

	let newFile = "";
	newFile = insertInstanceBeginFromEmpty(newFile, instance, html);
	newFile = insertInstanceEnd(newFile, instance);

	fs.writeFile(file, newFile, (err) => {
		if(err) throw new Error(err);

		console.log("File done!");
	})
}

function getExt(file){
	return path.extname(file);
}

function updateFilesFromTemplate(path, static){
	//console.log("Template path:", path);
	const fileExists = fs.existsSync(path);

	if(fileExists){
		const dir = static;
		const template = fs.readFileSync(path, "utf8");
		const files = fs.readdirSync(dir);
		//console.log("Template content:", template.split("").length);

		if(!template){
			updateFilesFromTemplate(path, static);
			return;
		}
			
		for(let file of files){
			const ext = getExt(file);

			if(ext === ".html")
				updateFile(`${dir}\\${file}`, template);
		}
	}else{
		console.log("Template file was removed.");
		console.log("Exiting...");
		process.exit(1);
	}
}

/**
 * Updates a file with the template.
 * @param {string} filePath - The absolute path to the file to update.
 * @param {string} template - The template html.
 */
function updateFile(filePath, template){
	const startTime = Date.now();

	const fileContents = fs.readFileSync(filePath, "utf8");
	const instance = getInstance(fileContents);

	// If no instance exists, cancel stop working on this file.
	if(!instance) return;

	const editableAreas = findEditableAreas(instance.content);
	const updatedFile = applyTemplate(editableAreas, instance, template);

	fs.writeFile(filePath, updatedFile, (err) => {
		if(err) throw new Error(err);
		const endTime = Date.now();
		const diff = endTime - startTime;
		
		console.log(`Applied template to ${path.basename(filePath)} in ${diff}ms...`);
	});
}

/**
 * 
 * @param {string} newFile - The file to update.
 * @param {Object} instance - An object return from getInstance()
 * @param {string} template - The template html.
 */
function insertInstanceBegin(newFile, instance, template){
	const beginningHtml = template.slice(0, instance.startIndex - instance.startComment.length);
	const endingHtml = template.slice(instance.startIndex - instance.startComment.length);
	newFile = beginningHtml + instance.startComment + "\n" + endingHtml;

	return newFile;
}

function insertInstanceBeginFromEmpty(newFile, instance, template){
	const openingHtmlTag = /(<html){1}.*>/gm;
	const match = openingHtmlTag.exec(template);
	const index = openingHtmlTag.lastIndex;
	newFile = template.slice(0, index) + "\n" + instance.startComment  + template.slice(index);

	return newFile;
}

/**
 * 
 * @param {string} newFile - The file to update.
 * @param {Object} instance - An object returned from getInstance()
 */
function insertInstanceEnd(newFile, instance){
	const closingHtmlTag = /(<\/html>){1}/gm;
	const match = closingHtmlTag.exec(newFile);
	const instanceEndIndex = closingHtmlTag.lastIndex - match[0].length;
	newFile = newFile.slice(0, instanceEndIndex) + instance.endComment + "\n" + newFile.slice(instanceEndIndex);

	return newFile;
}

/**
 * 
 * @param {Array} editableAreas - Array returned from findEditableAreas()
 * @param {Object} instance - Object returned from getInstance()
 * @param {string} template - The html from the template file.
 * @returns {string} The updated template file.
 */
function applyTemplate(editableAreas, instance, template){
	let newFile = "";
	newFile = insertInstanceBegin(newFile, instance, template);
	newFile = insertInstanceEnd(newFile, instance);
	
	for(area of editableAreas){
		const index = editableAreas.indexOf(area);
		const templateAreas = findEditableAreas(newFile);
		const tempArea = templateAreas[index];

		newFile = newFile.slice(0, tempArea.start).trim() + area.content + newFile.slice(tempArea.end).trim();
	}

	return newFile;
}

/**
 * Find the start and end indices plus the content of areas in a file.
 * @param {string} html - The html containing editable areas.
 * @returns {Object[]} List of objects containing start and end indices, as well as the content of editable areas.
 */
function findEditableAreas(html){
	const areas = [];
	const startTag = /((\<\!\-\-)\s(TemplateBeginEditable+?|BeginEditable+?)\s.*(\-\-\>+?)$)/gm;
	const endTag = /((\<\!\-\-)\s(TemplateEndEditable+?|EndEditable+?)\s.*(\-\-\>+?)$)/gm;

	while( (startTags = startTag.exec(html)) && (endTags = endTag.exec(html)) ){
		const start = startTag.lastIndex;
		const end = endTag.lastIndex - endTags[0].length;
		const content = html.substring(start, end);

		areas.push({start, end, content});
	}

	return areas;
}

/**
 * Checks whether or not instance comments exist in the file.
 * @param {string} html - The html to check.
 * @returns {boolean|Object} If instance comments are missing, a boolean of false will be returned. If instance comments are found, a string containing the instance will be returned.
 */
function getInstance(html){
	const instanceBegin = /(<!--)+.*(\bInstanceBegin\b)+.*(-->)+/g;
	const instanceEnd = /(<!--)+.*(\bInstanceEnd\b)+.*(-->)+/g;
	const start = instanceBegin.exec(html);
	const end = instanceEnd.exec(html);

	if(!start){
		return false;
	}

	if(!end){
		return false;
	}

	const startIndex = instanceBegin.lastIndex;
	const endIndex = instanceEnd.lastIndex - end[0].length;
	const result = html.substring(startIndex, endIndex);

	return {
		content: result,
		startComment: start[0],
		endComment: end[0],
		startIndex,
		endIndex
	}
}

module.exports = {
	listen
}