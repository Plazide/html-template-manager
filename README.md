# HTML Template manager

A simple template manager for html files.

## Installation

Easiest way to install this tool is by using npm:
```
npm install html-template-manager
```

It can also be added as a dev dependency:
```
npm install --save-dev html-template-manager
```

You could also just clone this repo and run.

## How to use?

To use the template manager you need to have a dedicated folder for your html like ```./static```. It is also recommended to create a folder containing your template/templates, like ```./templates/template.html```. Your template file will just be an ordinary html file containing comments that outline dedicated editable areas. 

### Specifying paths
To run the template manager simply do:
```bash
template <your-template-file> <your-html-folder>
```
By running the CLI with both of these arguments, the template manager will automatically create the files and folders if they don't already exist.

### Using default paths
Alternatively, you could omit the arguments and use the default paths that the manager creates for you:
```bash
template
```
This is the easiest way to run the manager.

### Without npm
If you, against my recommendations, chose to clone this repo, you would run:
```bash
node lib/index.js
```
This is not recommended since it will prevent you from add arguments.

### Editable areas

Inside of your template file, you dedicate editable areas by using ```<!-- BeginEditable -->``` and ```<!-- EndEditable -->```. It is recommended to wrap the entire title tag, both opening and closing tag, inside of these since comments are visible when inside the title tag.

## Examples

### Running with paths
Run the template manager with ```./templates/default.html``` as the template, and ```./static``` as your html folder. This example is run from the root directory of the application.
```bash
template templates/default.html static
```

### Template file
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