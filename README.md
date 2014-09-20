Bracket-Templates
=================

A mimimal JavaScript template engine inspired by [mustache](http://mustache.github.io/mustache.5.html) using square brackets, supporting default strings, sub-key notation, block iterators and truthy conditional logic.

###Instlation
```
$ npm install bracket-templates
```

###Options:
```js
var bracket = require('bracket-templates');
bracket.options = {
  prefix: '',   			// (default = none), an optional placeholder prefix string.
  debug: false  	// (default = false), enable debug messages on the console.
  strictKeys: false	// (default = false), when true, only mutate found keys - partial rendering.
};
```

###Render Method:
```js
bracket.render(template, dataObj[, options, callback])
```
 * template - Can be either a String or a Buffer (string-in, string-out & buffer-in, buffer-out).
 * dataObj  - Any javascript Object or Array.
 * options  - Local options obejct.
 * callback - A callback function.

###Template Tag Syntax: [ {propertyName} [: {defaultValue}] ]
Template placeholders are enclosed by square brackets (obviously), and represent data object property names and/or any nested key identifiers (via dot, hyphen, or undersocre  notation). Optionally, a default value can be included by adding a colon followed by the default string.  Tempalte placeholders support both truthy conditional blocks and list/dict iterator blocks. Additionally, tempalte placeholders may contain an optional prefix.


###Block Constructs: [ [\#, ~, ^, !]{propertyName} ]
Blocks begin with an opening tag and end with a closing tag, and may span multiple lines.  Opening block tags must contain one of the following prefixes preceeding the {propertyName}.
* \# (iterator block)
  * If the propertyName represents an object or array, repeat the block with the value of each element.  Otherwise, repeat the block with the full object.

* ~ (truthy block)
  * Render the block if the propertyName exists and is truthy.

* ^ (falsy block)
  * Render the block if the propertyName does not exists or is falsy.

* ! (falsy bock)
  * Render the block if the propertyName does not exists or is falsy.


###Special placeholder names:
* KEY/INDEX - the current property name or index in a iterator.  In a logical block this is the logical key name.
* VALUE - The current property or item value in an iterator. In a logical block this is the boolean value.


###Rendering a template:
```js
var bracket = require('bracket-templates');
var data = {
  thing: "World"
};

console.log( bracket.render('Hello [thing]. I like [ color : green ].', data) );
```

This code would return the rendered string "Hello World. I like green."  Since there is no property "color" in the data object, the default value is used.

Whitespace inside tag brackets is generally ignored, but preserved inside the context of the {defaultValue}.  Both tags
`[name:default]` and `[ name : default ]` are equivalent.


###Examples:

----

**A basic template with some default text.**
```text
[ name : Joe Somebody ]
[ address ]
[ phone ]
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  name: false,
  addres: '123 Any Street, Anytowne, OH',
  phone: 5551212
};
console.log( bracket.render( String(template), data ) );
```


----

**A templalte using the optional prefix 'object'.**
```text
Hello [ object-name ]
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  name: 'Joe User'
};
console.log( bracket.render( String(template), data, {prefix: 'object'} ) );
```


----

**A template using dot based sub-key notation (alternately, hyphens and underscores are supported)**
```
Hello [ company.employees.0.name : mindless worker ].
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  company: {
    employees: [{
      name: 'Joe User'
    }]
  }
};
console.log( bracket.render( String(template), data ) );
```


----

**An iterator block using sub-key notation.**
```
Employees:
[ #company.employees ]
  name: [ name ]
[ /company.employees ]
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  company: {
    employees: [{
      name: 'Joe Worker'
    },{
      name: 'Jane Person'
    }]
  }
};
console.log( bracket.render( String(template), data ) );
```


----

**An object iterator using specials.**
```
[ #properties ]
  [ KEY ]: [ VALUE ]
[ /properties ]
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  properties: {
    name: 'Joe User',
    age: 37
  }
};
console.log( bracket.render( String(template), data ) );
```


----

**A truthy conditional block.**
```
[ ~taxable ]
  Please cut off your leg.
[ /taxable ]
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  taxable: 'yes'
};
console.log( bracket.render( String(template), data ) );
```


----

**A falsy conditional block.**
```
[ ^taxable ]
  Aren't you lucky!
[ /taxable ]

or

You are [ !taxable ] not [ /taxable ] taxable.

```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {};
console.log( bracket.render( String(template), data ) );
```


----

**A truthy conditional iterator block.**
```
[ #taxable ]
  You owe [ taxRate : 100% ] of your income.
[ /taxable ]
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  taxable: {
    taxRate: '99%'
  }
};
console.log( bracket.render( String(template), data ) );
```


----

**Escaping some literal bracket text.**
```
Example: \[ someName ] would render [ someName ]

Allternately \[ someName \] will render [ someName ]
```
**Code:**
```js
var bracket = require('bracket-templates');
var template = fs.readFileSync('./template.txt');
var data = {
  someName: 'Test'
};
console.log( bracket.render( String(template), data ) );
```


_Please report any issues_
