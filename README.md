Bracket-Templates
=================

A mimimal JavaScript template engine inspired by [mustache](http://mustache.github.io/mustache.5.html) using square brackets, supporting default strings, sub-key notation, block iterators and truthy conditional logic.   


###Template Syntax:

Template placeholders are enclosed by square brackets (obviously), and represent data object property names and/or any nested key identifiers (via dot, hyphen, or undersocre  notation). Optionally, a default value can be included by adding a colon followed by the default string.  Tempalte placeholders support both truthy conditional blocks and list/dict iterator blocks. Additionally, tempalte placeholders may contain an optional prefix.   

**[** {propertyName} [: {defaultValue}] **]**

Special placeholder names:
* KEY/INDEX - the current property name or index in a iterator.  In a logical block this is the logical key name.
* VALUE - The current property or item value in an iterator. In a logical block this is the boolean value.

###Examples:

A basic template with default text.
```text
[ name : Joe Somebody ]
[ address ]
[ city ], [state]  [zip]
[ phone ]
```

A templalte using the optional prefix 'object'.
```text
Hello [ object-name ]
```

A template using dot based sub-key notation (alternately, hyphens and underscores are supported)
```
Hello [ company.employees.0.name : mindless worker ].
```

An iterator block using sub-key notation.
```
Employees: 
[ #company.employees ]
  name: [ name ]
[ /company.employees ]
```

An object iterator.
```
[ #properties ]
  [ KEY ]: [ VALUE ]
[ /properties ]
```

A truthy conditional block.
```
[ ~taxable ]
  Please cut off your leg.
[ /taxable ]
```

A falsy conditional block.
```
[ ^taxable ]
  Aren't you lucky!
[ /taxable ]

or

You are [ !taxable ] not [ /taxable ] taxable.

```

A truthy conditional iterator block.
```
[ ~taxable ]
  You owe [ taxRate : 100% ] of your monies. 
[ /taxable ]
```
Requires the data object:
```
{
  taxable: {
    taxRate: '99%'
  }
}
```

Escaping some literal bracket text.
```
Example: \[ someName ] would render [ VALUE ]

Allternately \[ someName \] will render [ VALUE ] 
```

###Iterator Blocks
Iterators begin 

###Options:
Object.options 
* *prefix* - (default = none), an optional placeholder prefix string.
* *debug* - (default = false), enable debug messages on the console.


###Render Method:

Object.render(template, dataObj[, options, callback])

 * template - Can be either a String or a Buffer.
 * dataObj - Any javascript Object or Array.
 * options - Local options obejct. Default = { prefix: "object" }
 * callback - A callback function.


####Rendering a template:

```javascript
var tmpl = require('bracket-templates');
var data = {
  thing: "World"
};

var out = tmpl.render('Hello [thing]. I like [ color : green ].', data);
```

In the last example, would return the rendered string "Hello World. I like green."  Since there is no property "color" in the data object, the default value is used.

Whitespace inside a placeholder is generally ignored, but preserved inside the context of the defaultValue.  Both tags
`[name:default]` and `[ name : default ]` are equivalent.


