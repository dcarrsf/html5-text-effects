# html5-text-effects
Text Effects API with HTML5 Canvas, CSS, and SVG

Simple JavaScript API designed to render and compare text effects generated with HTML5 canvas, CSS, and SVG. This project was originally created while working on HTML5 projects with Adobe. The goal was to create web standard animated effects, similar to what we might create in Flash (letter by letter, word by word, and so on). The question was, how to do it and make it work across devices? 

To address the problem, I created a JavaScript API that works across media types.

**SVG**

I started with SVG leveraging the RaphaelJS library for support. SVG by far has the most configuration options, and renders smoothly on desktop and devices with enough power. Raphael animations are rendered as vectors within the SVG element, so the quality is very impressive. Definitely a great option for desktop.
```javascript
  var canvas = Text.SVG("canvas"); // div id
  var text = canvas.addText("Typography", {
    //...
  });
  text.animate("zoomInBig");
```
**CSS**

Next, I tried working with CSS animations. CSS animations manipulate text in the DOM. Animating words works well, but aimating letter by letter can run into issues. Overall, animating on the DOM is not the best direction compared to other options. Implementing hardware acceleration would help this API.
```javascript
  var canvas = Text.CSS("canvas"); // div id
  var text = canvas.addText("Typography", {
    //...
  });
```
**HTML Canvas**

And finally, I setup the animation API on the canvas using CreateJS for support. Canvas animations run on the canvas element, and therefore perform well. While canvas has some limitations, in overall testing across devices it performed the best on mobile (whereas SVG and CSS showed issues on lower powered devices).
```javascript
  var canvas = Text.Canvas("canvas"); // canvas id
  var text = canvas.addText("Typography", {
    //...
  });
```
**Known Issues**

As described, issues related to performance appear depending on the size of the canvas, the complexity of the animation, and the type of technology used. Animating multiple words across multiple lines needs some work. Some issues appear with stroke and shadow properties when linking animations.
