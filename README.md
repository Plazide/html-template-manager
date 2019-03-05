# HTML Template manager

A simple template manager for html files.

## Installation

Easiest way to install this tool is by using npm:
```sh
npm install -g html-template-manager
```

It can also be added as a dev dependency:
```sh
npm install --save-dev -g html-template-manager
```

You could also just clone this repo and run.

This package should be installed globally to work properly, which means you need the `-g` flag.

## How to use?

Once the package is installed globally, all you need to do is run:
```sh
template
```
or, to update files once:
```
template --once
```

By using these either of these commands, the html-template-manager will create the necessary folders and files that it needs to function. These include the `./static` folder where your html files will be placed, and `./templates/template.html` which is your template file. Any html that is the same across html files should be in here.

#### Use cases
This template manager supports two kinds of use cases. You can either run the template CLI and let it update your html files everytime you make changes to your template, or you could run it manually whenever you see fit.

#### Specifying paths
To run the template manager simply do:
```sh
template <your-template-file> <your-html-folder>
```
or, to only run it once to update changes:
```sh
template <your-template-file> <your-html-folder> --once
```

By running the CLI with both of these arguments, the template manager will automatically create the files and folders if they don't already exist. It will also save the paths so that you don't have to specify them again, look at [Not specifying paths](#not-specifying-paths). If you for some reason decide you want to change the paths in the future, simply run the same command but specify different paths.

#### Not specifying paths
Alternatively, you could omit the arguments and use the default paths that the manager creates for you:
```sh
template
```
or, to only run it once and update changes:
```sh
template --once
```
This is the easiest way to run the manager.

If you have already given the template manager paths in the past, they will be saved. This means that you can run the manager this way everytime but the first time. If you don't want custom paths, then you only ever have to use it this way.

#### Without npm
If you chose to clone this repo, you would run:
```sh
node lib/index.js
```
This is not recommended since it will prevent you from adding arguments.

#### Declaring template files
Files that are supposed to inherit the html of the template will need `<!-- TemplateFile -->` comment somewhere inside of them. It doesn't really matter where the comment is placed, but it is recommended to put it at the top of the head tag.

#### Declaring editable areas
Inside of your template file, you dedicate editable areas by using `<!-- BeginEditable -->` and `<!-- EndEditable -->`. It is recommended to wrap the entire title tag, both opening and closing tag, inside of these since comments are visible when inside the title tag.

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