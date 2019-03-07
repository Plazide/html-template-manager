# HTML Template manager

A simple template manager for html files.

## Installation

Installing globally, this is the easiest way to install:
```sh
npm install -g html-template-manager
```
When installing globally, refer to [Using globally](#using-globally).

Installing locally:
```sh
npm install --save-dev html-template-manager
```
When installing locally, refer to [Using locally](#using-locally).

You could also just clone this repo:
```sh
git clone https://github.com/Plazide/html-template-manager.git
```

## How to use?

### Using locally

#### Run with npm scripts
When installing locally in a project folder, you need to create scripts in your package.json file to be able to run the template manager. Use the following examples as a reference.

```json
{
  "name": "MyProject",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
	"template": "template",
	"init": "template templates/template.html static",
	"once": "template --once",
	"paths": "template --paths"
  }
}

```

Using the example above, you would use the following commands,

to update files as you make changes to the template file:
```sh
npm run template
```  
<br/>
to set paths to the template file and html folder:
```sh
npm run init
```  
<br/>
to update html files once:
```sh
npm run once
```  
<br/>
to see which paths the manager is currently using:
```sh
npm run paths
```

#### Run together with other scripts
Alternatively, you could use something like [Concurrently](https://www.npmjs.com/package/concurrently) to run the template manager at the same time as other scripts.

For example:
```json
{
  "name": "MyProject",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
	"start": "concurrently \"template\" \"node server.js\"",
	"init": "template templates/template.html static",
	"once": "template --once",
	"paths": "template --paths"
  }
}
```

To run the template manager at the same time as the server, you would just do:
```sh
npm start
```

### Using globally

#### Not specifying paths
Once the package is installed globally, all you need to do is run:
```sh
template
```
or, to update files once:
```
template --once
```

By using these either of these commands, the html-template-manager will create the necessary folders and files that it needs to function. These include the `./static` folder where your html files will be placed, and `./templates/template.html` which is your template file.

If you have already specified paths using one of the methods in [Specifying paths](#specifying-paths), these commands will use those paths.

#### Specifying paths
To run the template manager simply do:
```sh
template <your-template-file> <your-html-folder>
```
or, to update files once:
```sh
template <your-template-file> <your-html-folder> --once
```

By running the CLI with both of these arguments, the template manager will automatically create the specified files and folders if they don't already exist. It will also save the paths so that you don't have to specify them again. If you for some reason decide you want to change the paths in the future, simply run the same command but specify different paths.

If you want to see which paths you currently have configured, you can run:
```sh
template --paths
```

#### Declaring template files
Files that are supposed to inherit the html of the template will need `<!-- TemplateFile -->` comment somewhere inside of them. It doesn't really matter where the comment is placed, but it is recommended to put it at the top of the head tag.

#### Declaring editable areas
Inside of your template file, you dedicate editable areas by using `<!-- BeginEditable -->` and `<!-- EndEditable -->`. It is recommended to wrap the entire title tag, both opening and closing tag, inside of these since comments are visible when inside the title tag.

## Without npm
If you chose to clone this repo, you would run:
```sh
node lib/index.js
```
This is not recommended since it will prevent you from adding arguments.

## Examples

#### Running with paths
Run the template manager with `./templates/default.html` as the template, and `./static` as your html folder. This example is run from the root directory of the application.
```sh
template templates/default.html static
```

#### Template file
A basic template file.
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<!-- BeginEditable -->
	<title>Document</title>
	<!-- EndEditable -->
</head>
<body>
	<header>
		<a href="/index.html">Home</a>
		<a href="/contact.html">Contact</a>
		<a href="/about.html">About</a>
	</header>
	<!-- BeginEditable -->

	<!-- EndEditable -->
</body>
</html>
```