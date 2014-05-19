Bracket-Templates
=================

Dead simple JavaScript templates using square brackets. 


###Render Method:

Object.remder(content, dataObj[, options, callback])


###Template Syntax:

Template tags are enclosed by square brackets (obviously), and contain a prefix (default=object) followed by a hyphen, underscore or period, and a property name. Optionally, a default value can be specified by adding a colon followed by the default stringto the tag.  

**[** {prefix}[_-.]{propertyName} [: {defaultValue}] **]**


###Examples:

A basic template.

```text
[ object-firstName ] [ object-lastName ]
[ object-streetAddress ]
[ object-city ], [object-state]  [object-zip]
```

A templalte with defaults.
```text
Hello [ object-name : World ]!
```

rendering a template

```javascript
var bTemplate = require('Bracket-Templates');
var data = {
  name: "World"
};

var out = bTemplate.render('Hello [object-name]. Favorite color is [ object-color : green ].', data);
```

In the last example, out would countain the rendered string "Hello World. Favorite color is green."  Since there is no property "color" in the data object, the default value is used.

Whitspace inside the tag is generally ignored, but preserved inside the context of the defaultValue.  Both tags

    [object-name:default]

and

    [ object-name : default ]

are equivalent.
    
