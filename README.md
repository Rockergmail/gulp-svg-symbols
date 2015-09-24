# gulp-svg-symbols

[![NPM version](https://badge.fury.io/js/gulp-svg-symbols.svg)](http://badge.fury.io/js/gulp-svg-symbols) [![Build Status](https://travis-ci.org/Hiswe/gulp-svg-symbols.svg?branch=master)](https://travis-ci.org/Hiswe/gulp-svg-symbols)

*gulp-svg-symbols* is a minimal plugin for [gulp](http://gulpjs.com).  
It converts a bunch of svg files to a single svg file containing each one as a symbol.  
See [css-trick](http://css-tricks.com/svg-symbol-good-choice-icons/) for more details.

The plugin produces 2 files:

- *svg-symbols.svg* containing all SVG symbols
- *svg-symbols.css* containing all classes with the right svg sizes

## Install

```
npm install --save-dev gulp-svg-symbols
```

## Example

In your gulpfile.js:

```js
var gulp       = require('gulp');
var svgSymbols = require('gulp-svg-symbols');

gulp.task('sprites', function () {
  return gulp.src('assets/svg/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('assets'));
});
```

In your HTML, you first have to [reference the SVG](http://css-tricks.com/svg-sprites-use-better-icon-fonts/)  
then:

```html
<svg role="img" class="github">
  <use xlink:href="#github"></use>
</svg>
```

- **class** is the one generated in the CSS file
- **xlink:href** is the symbol id in the SVG file

## Options

You can override the [default options](https://github.com/Hiswe/gulp-svg-symbols/blob/master/lib/default-config.js) by passing an object as an argument to `svgSymbols()`

### Basics

#### id & className

Text templates for generating icon class & symbols id  
`%f` is the [slugged](https://www.npmjs.com/package/slug) file name placeholder.

#### fontSize

This option lets you define a base font.  
If it's superior to 0, then the sizes in your CSS file will be in **em**.

#### title

Specify whether or not you want the `title` tag in your SVG symbols.  
It should be better for *accessibility*.  
It takes a text template (like for [id/classname](https://github.com/Hiswe/gulp-svg-symbols#id--classname)) or `false` if you want to remove it:

```js
title: false
```

#### css generation

Not really an option but you can deactivate CSS output by removing the CSS template from the template array.  
See [templates option](https://github.com/Hiswe/gulp-svg-symbols#templates) for more details.

```js
templates: ['default-svg']
```

#### demo page

Like above, not really an option.  
You can generate a simple demo page by adding `default-demo` to the templates array.

```js
var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');

gulp.task('demo', function () {
  return gulp.src('assets/svg/*.svg')
    .pipe(svgSymbols({
      templates: ['default-demo']
    }))
    .pipe(gulp.dest('tmp'));
});
```

#### silent

Disable warn messages about missing viewBox.

### Advanced

#### templates

Specify your own templates by providing an absolute path:

```js
templates: [
  path.join(__dirname, 'path/to/my/template.stylus'),
  path.join(__dirname, 'path/to/another/template.html'),
  // You can still access to default templates by providing:
  'default-svg',
  'default-css',
  'default-demo'
]
```

- template engine is [lodash](http://lodash.com/docs#template).
- all svg files info are stored in the `icons` array and passed to every templates.
- the output files will have the same name & extension as your files.

#### transformData

With the ability to provide custom templates, you also have the ability to configure custom data.

```js
transformData: function(svg, defaultData, options) {
  /******
  svg is the object containing :
    content (svg markup)
    width   (in numeric — no units)
    height  (in numeric — no units)
    viewBox (as a string)
    name    (svg filename without extension)
    originalAttributes (object of what was gathered from svg tag)

  defaultData are the ones needed by default templates
  see /lib/get-default-data.js

  options are the one you have set in your gulpfile,
    minus templates & transformData
  *******/

  return {
    // Return every datas you need
    id:         defaultData.id,
    className:  defaultData.className,
    width:      svg.width + 'em',
    height:     svg.height + 'em'
  };
}

```

In your templates, svg original data are accessible in `icon.svg`.  
Of course default templates need `defaultData`.

#### transformSvg

Your transform function have on paramater the [cheerio](https://www.npmjs.org/package/cheerio) object of the whole svg.  
You have to return this object after modification.

### Other observations

- If you want to change the file name, use [gulp-rename](https://www.npmjs.org/package/gulp-rename)  
- If you want to change the generated files name, again use [gulp-rename](https://www.npmjs.org/package/gulp-rename)
- If you want different destination for the files, use [gulp-if](https://www.npmjs.org/package/gulp-if)
- Unlike [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) there is no way to add padding to svg files.

## Migrating

### from v0.2+ to v1.0

- SVGO is no more used. If you want to optimize your SVG use:  
  - [gulp-svgmin](https://www.npmjs.org/package/gulp-svgmin) (using SVGO)
  - or [gulp-cheerio](https://www.npmjs.com/package/gulp-cheerio)
  - or anything you like :)
- `css: false` is removed.
- svgSymbols.demoPage() method has been removed. See **Basics > demo page**

### from v0.1 to 0.2+

- `svgId` is replaced by `id`.
- `accessibility` is replaced by `title`.
- `css: false` is still working but is deprecated.

## The big fat example:

```js
var path        = require('path');
var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var rename      = require('gulp-rename');
var svgSymbols  = require('gulp-svg-symbols');

var customCSSTemplate = path.join(__dirname, './icons.styl');

gulp.task('sprites', function () {
  return gulp.src('assets/svg/*.svg')
  .pipe(rename(renameFunction))
  .pipe(svgSymbols({
    svgId:      'icon-%f',
    className:  '.icon-%f',
    title:      false,
    fontSize:   16,
    templates: ['default-svg', 'default-demo', 'customCSSTemplate']
  }))
  .pipe(rename(outputFilesRenameFunction))
  .pipe(gulpif( /[.]svg$/, gulp.dest('views/svg')))
  .pipe(gulpif( /[.]styl$/, gulp.dest('front/css')))
  .pipe(gulpif( /[.]html$/, gulp.dest('tmp')));
});
```

## All credits goes to

- [Chris Coyier](http://css-tricks.com/) for the [trick](http://css-tricks.com/svg-symbol-good-choice-icons/)
- [Shaky Shane](https://www.npmjs.org/~shakyshane) for the [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) plugin
- [FWeinb](https://github.com/FWeinb) for the [grunt-svgstore](https://github.com/FWeinb/grunt-svgstore) plugin

## Alternatives

- [gulp-svg-sprite](https://www.npmjs.com/package/gulp-svg-sprite)
- [gulp-svg-store](https://www.npmjs.com/package/gulp-svgstore)
- [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) (not actively maintained)
