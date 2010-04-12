# ringo-processing

ringo-processing is a [RingoJS](http://ringojs.org/) package that allows you to write [Processing](http://www.processing.org/) sketches in ([modern](https://developer.mozilla.org/en/New_in_JavaScript_1.8)) JavaScript.

## Warning

This is alpha code and mostly untested on anything other than OS X.

If you have questions (or answers!) please get in touch (on e.g. the [RingoJS mailing list](http://groups.google.com/group/ringojs) or the [#ringojs IRC channel on Freenode](irc://irc.freenode.net/ringojs)).

## News

- 2010-04-06: A first version of `ringo/processing/web` is in.

## Installation

Once you have a [working RingoJS installation](http://github.com/ringo/ringojs#readme):

    ringo-admin install chl/ringo-processing

Alternatively, simply check out this Git repository inside the RingoJS `packages` directory.

## Samples

Samples will be collected in a separate [ringo-processing-samples](http://github.com/chl/ringo-processing-samples) project.

## API

With minor divergences (see below), the [Processing API](http://www.processing.org/reference/) as you know and (hopefully) love it is available as you'd expect.

ringo-processing currently supports two styles of writing sketches.

### Simple Style

A sketch object (accessible as `sketch`) and the Processing API<sup>1</sup> are injected into a given scope:

    require("ringo/processing").wire(this);

    function setup() {
        size(400, 400);
        background(0);
        colorMode(RGB, 1);
        strokeWeight(5);
        stroke(0.75, 0, 0);
    }

    function draw() {
        line(0, 0, width, height);
        line(0, height, width, 0);
    }
    
    run();

### Prototype Style

This second style is particularly useful if you want to package sketches as re-usable RingoJS modules:

    var {Sketch, RGB} = require("ringo/processing");

    export("X");

    function X() {};

    X.prototype = new Sketch();

    X.prototype.setup = function() {
        this.size(400, 400);
        this.colorMode(RGB, 1);
        this.background(0);
        this.strokeWeight(5);
        this.stroke(0.75, 0, 0);
    };

    X.prototype.draw = function() {
        this.line(0, 0, this.width, this.height);
        this.line(0, this.height, this.width, 0);
    };

    if (require.main == module.id)
        new X().run();

## Divergences

- `frameRate`: Implemented as read/write property instead of field/method pair.
- `mousePressed`/`isMousePressed`: `mousePressed` corresponds to the event handler, `isMousePressed` to the field.
- `keyPressed`/`isKeyPressed`: See above.
- `mousePressed` vs. `mousePressedEvent` &c.: `*Event` versions of event handlers get an event argument.
- Additional events: `sketchResized`, `sketchResizing`

## Live-Coding

Of course! Just start `ringo`, wire up ringo-processing and let it roll.

A typical (if not particularly exciting) REPL session might look like that:

    require("ringo/processing").wire(this)
    run({exit: false}) // do not exit when frame is closed
    r = random, bg = background, f = fill // let's define some abbreviations
    t = 10 // parametric design is about to begin!
    draw = function() {f(100 + r(50), 0, 0); rect(r(width), r(height), t, t)}
    noStroke() // those strokes definitely need to go
    bg(0) // let's start over
    size(600, 200)
    t = 25
    ...

In order to run and modify an existing sketch interactively, explore the `ringo` `-i` option:

    ringo -i ringo-processing-samples/lp/example-9-8.js

## Web Applications

For now, see [ringo/processing/web/demo](http://github.com/chl/ringo-processing/tree/master/lib/ringo/processing/web/demo/). More spectacular documentation is being prepared.

## Processing Libraries

Work in progress. Only OpenGL tested so far. Use `use`:

    function setup() {
        use("opengl");
        size(800, 600, OPENGL);
        ...
    }

Support for sketch-specific libraries is forthcoming.

## Caveats

- Performance: If you want speed, you'll probably need to use Java.
- Initialization: While `wire` sets up all functions, properties &c., actually using the Processing API will only work after calling `run` (which initializes the Processing applet). In other words: Apart from variable declarations, most initialization code should go into `setup`.
- Threads: Be advised that at least two threads are involved - the Swing event dispatching thread and the Processing animation thread. To ensure that code executes on the correct thread, call Processing API functions only from the Processing event handlers (`setup`, `draw` &c.); in case you need to interact with Swing, look up `invokeLater`/`invokeAndWait` in [SwingUtilities](http://java.sun.com/javase/6/docs/api/javax/swing/SwingUtilities.html).
- OpenGL sketches & REPL API interaction: Leads to segfaults (probably due to threading issues).

## Related Projects

- [ruby-processing](http://github.com/jashkenas/ruby-processing): The gold standard when it comes to dynamic-language Processing wrappers.
- [Spde](http://technically.us/spde/About)
- [incanter-processing](http://data-sorcery.org/2009/08/30/processing-intro/)

## Plans/Todo

- A runner (to do away with boilerplate code in simple mode)
- A "control panel" similar to what ruby-processing offers
- Higher-order library (grid, eachPoint &c.)?
- NodeBox-like color utilities
- Probably not: Applet (web) export

## Done

- Web application PGraphics sugar: imageResponse &c.

## License

ringo-processing is available under the same license as RingoJS.

Processing, core components of which are bundled with ringo-processing, is distributed under the terms of the GNU Lesser General Public License.

## Footnotes

<sup>1</sup> Or: "appropriately-bound functions/properties/constants representing the Processing API"
