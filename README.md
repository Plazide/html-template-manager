# HTML Template Manager
This is a simple HTML template manager.

## How to use?
Right now there is no CLI implemented, so the best way to use this tool is to clone this repo and then run:
```
node index.js
```
This will assume that your template is placed in a file called ```template.html``` located in ```./templates```, and your editable html files are places in ```./static```. While the script is running, it will automatically detect when new files are created in the static folder and add the template html to them. For this reason, it is best to run the script before creating any html files.

### Editable areas
To dedicate editable areas we use comments like ```<!-- BeginEditable -->``` and ```<!-- EndEditable -->```. It is recommended to wrap the entire title tag inside of these since comments are visible when used inside the title tags.

## Example
The following is a basic example of how to use this repo.
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <!-- BeginEditable --><title>This is template</title><!-- EndEditable -->
    </head>
    <body>
        <header>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </header>
        <!-- BeginEditable -->
            
        <!-- EndEditable -->
    </body>
</html
```
