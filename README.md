Bracket-Templates
=================

A mimimal JavaScript template engine using square brackets w/ defaults.   


###Options:
Object.options 
* *prefix* - (default = none), an optional placeholder prefix string.
* *debug* - (default = false), enable debug messages on the console.


###Render Method:

Object.render(content, dataObj[, options, callback])

 * content - Can be either a String or a Buffer.
 * dataObj - Any javascript Object or Array.
 * options - Local options obejct. Default = { prefix: "object" }
 * callback - A callback function.


###Template Syntax:

Template placeholders representing property names and/or any nested key via dot notation are enclosed by square brackets (obviously), and may contain an optional prefix. Optionally, a default value can be included by adding a colon followed by the default string.  Tempalte placeholders support both truthy conditional blocks and list/dict iterator blocks.   

**[** {propertyName} [: {defaultValue}] **]**


###Examples:

A basic template.

```text
[ firstName : Joe ] [ lastName : Somebody ]
[ streetAddress ]
[ city ], [state]  [zip]
```

A templalte using the prefix 'object'.
```text
Hello [ object-name ]
```

####Rendering a template:

```javascript
var bTemplate = require('bracket-templates');
var data = {
  thing: "World"
};

var out = bTemplate.render('Hello [thing]. My favorite color is [ color : green ].', data);
```

In the last example, would return the rendered string "Hello World. Favorite color is green."  Since there is no property "color" in the data object, the default value is used.

Whitspace inside the tag is generally ignored, but preserved inside the context of the defaultValue.  Both tags

    [name:default]

and

    [ name : default ]

are equivalent.
    

