PostCSS in Javascript
=====================

Scoped, modular CSS in javascript

What is this?
-------------

This library converts a tagged template string into scoped CSS in javascript using PostCSS.

It has the ability to scopeify:

* Converts HTML elements into classes
* Classes
* Ids
* Keyframes

It also has the ability to use any PostCSS plugin before being scopeified.

Usage
-----

```js
const psjs = require('psjs');
const getCss = psjs.getCss;

const css = psjs`.cool, .story { display: flex; }`;
console.log(css);
/*
{
  cool: {
    type: 'class',
    scopedName: 'cool_4k44bl',
    selector: '.cool_4k44bl',
  },
  story: {
    type: 'class',
    scopedName: 'story_4k44bl',
    selector: '.story_4k44bl',
  },
}
*/
console.log(getCss(css));
// .cool_4k44bl, .story_4k44bl { display: flex; }
```

Add PostCSS plugins

```js
const autoprefixer = require('autoprefixer');
const psjs = require('psjs').psjs({ plugins: [autoprefixer()] });
const getCss = psjs.getCss;

const css = psjs`.prefix { display: flex; }`;
console.log(css);
/*
{
  prefix: {
    type: 'class',
    scopedName: 'cool_gQhnX',
    selector: '.cool_gQhnX',
  }
}
*/
console.log(getCss(css));
// .prefix_gQhnX { display: -webkit-box; display: -ms-flexbox; display: flex; }
```

No scope

```js
const psjs = require('psjs');
const noScope = psjs.psjs({ scopeifyFn: () => name => name });
const getCss = psjs.getCss;

const css = noScope`.cool { display: flex; } div { font-size: 12px; }`;
console.log(css);
/*
{
  type: 'class',
  scopedName: 'cool',
  selector: '.cool',
}
*/
console.log(getCss(css));
// .cool { display: flex; }  div: { font-size: 12px; }
```

Modify scope hash

```js
const psjs = require('psjs').psjs({ scopeifyFn: hashFn });
const getCss = psjs.getCss;

const css = psjs`.another:hover { color: tomato; }`;
console.log(getCss(css));
// .another_1472311107:hover { color: tomato; }

function hashFn(css) {
  return scopedName(name) {
    return name + '_' + Math.round(+new Date()/1000);
  }
}
```

Options
-------

* plugins (Array, default: []): adds PostCSS plugins before the scopeify plugin
* scopeifyFn (Function, default: base64 encode CSS): the function that hashes the identifier name
* ids (Boolean, default: false): determines whether or not to disable scoping `ids`
* elements (Boolean, default: false): determines whether or not to disable scoping `elements`
* classes (Boolean, default: true): determines whether or not to disable scoping `classes`
* keyframes (Boolean, default: true): determines whether or not to disable scoping `keyframes`

Inspiration
-----------

This library is heavily inspired by [CSJS](https://github.com/rtsao/csjs) which attempts to solve
the same problems with a mostly identical API.  The primary differences are:

* we use PostCSS to scopeify,
* we can use PostCSS plugins at runtime,
* we have the ability to scopeify elements and ids; and
* we have the ability to modify the scopeify algorithm.

Tooling
-------

### Extract CSS for a static bundle
### Automatically injext CSS
### Syntax Highlighting
