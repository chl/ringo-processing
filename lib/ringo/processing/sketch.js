var fs = require("fs-base");

var api = require("./api");
var utils = require("./utils");
var constants = require("./constants");

export("Sketch");

// --

var swing = javax.swing;
var processing = Packages.processing;

// --

function Sketch() {
    if (!(this instanceof Sketch))
        return new Sketch();
}

Sketch.prototype.run = function(options) {
    if (this.frame)
        return;
    var {title, exit, resizable, suspendDuringResize} = options || {};
    var instance = this;
    this.frame = new swing.JFrame(title || "ringo/processing");
    if (exit !== false)
        this.frame.setDefaultCloseOperation(swing.JFrame.EXIT_ON_CLOSE); 
    this.frame.setResizable(resizable !== false);
    // chl: OpenGL sketches hang/crash when looping while being resized (@@ revisit)
    this.suspendDuringResize = suspendDuringResize;
    this.frame.addComponentListener(new java.awt.event.ComponentAdapter() {
        componentResized: function(e) {
            if (instance.suspendDuringResize && instance.wasLooping) {
                instance.applet.loop();
                delete instance.wasLooping;
            }
            if (instance.sketchResized)
                instance.sketchResized(e);
        },
        componentMoved: function(e) {
            var {x, y} = e.component;
            var looping = instance.applet && instance.applet.looping();
            // while resizing is in progress, COMPONENT_MOVED (!) events are sent
            if (looping && x == instance.pframeX && y == instance.pframeY) {
                if (instance.suspendDuringResize) {
                    instance.applet.noLoop();
                    instance.wasLooping = true;
                }
                if (instance.sketchResizing)
                    instance.sketchResizing(e);
            }
            instance.pframeX = x;
            instance.pframeY = y;
        }
    });
    var handler = function(name) {
        return function() {
            // print("handler: " + name)
            if (instance[name])
                return instance[name].apply(instance, arguments);
        };
    };
    var safeHandler = function(name) {
        return function() {
            try {
                if (instance[name])
                    return instance[name].apply(instance, arguments);
            } catch (e) {
                print("Unwiring " + name + "; exception: " + e);
                instance[name] = null;
            }
        }
    };
    var eventHandler = function(name, kind) {
        var handler0 = handler(name);
        var handler1 = handler(name + "Event");
        return function() {
            if (arguments.length) {
                this["super$" + name + "(java.awt.event." + kind + "Event)"].apply(this, arguments);
                handler1.apply(this, arguments);
            } else {
                handler0.apply(this);
            }
        }
    };
    var overrides = {
        adapterSetup: handler("setup"),
        draw: safeHandler("draw")
    };
    for each (let [events, kind] in [[api.mouseEvents, "Mouse"], [api.keyEvents, "Key"], [api.focusEvents, "Focus"]])
        for each (let x in events)
            overrides[x] = eventHandler(x, kind);
    this.applet = new JavaAdapter(Packages.ringo.processing.Applet, overrides);
    this.frame.add(this.applet);
    this.applet.init();
    // wait until applet knows its size
    while (this.applet.defaultSize && !this.applet.finished)
        java.lang.Thread.sleep(10);
    this.frame.pack();
    this.frame.show();
    this.pframeX = this.frame.x;
    this.pframeY = this.frame.y;
};

for each (let x in api.methods)
    Sketch.prototype[x] = (function(x) function() this.applet[x].apply(this.applet, arguments))(x);

for each (let x in api.properties)
    if (typeof x == "string") {
        (function(x) Object.defineProperty(Sketch.prototype, x, {
            get: function() this.applet[x],
            configurable: true
        }))(x);
    } else {
        (function(x) Object.defineProperty(Sketch.prototype, x.name, x))(x);
    }

Sketch.prototype.wire = function(object) {
    var instance = object.sketch = this;
    for (let x in constants)
        object[x] = constants[x];
    for each (let x in api.methods.concat(["run", "use"]))
        object[x] = (function(x) function() instance[x].apply(instance, arguments))(x);
    for each (let x in api.properties)
        if (typeof x == "string") {
            (function(x) Object.defineProperty(object, x, {
                get: function() instance.applet[x],
                configurable: true
            }))(x);
        } else {
            (function(x) Object.defineProperty(object, x.name, {
                get: function() x.get.apply(instance),
                set: function() {x.set.apply(instance, arguments);},
                configurable: x.configurable
            }))(x);
        }
    for each (let x in api.events)
        this[x] = (function(x) function() object[x] && object[x].apply(this, arguments))(x);
    for each (let [k, v] in Iterator(api.classes))
        object[k] = Packages[v];
};

Sketch.prototype.size = function() {
    // initial resize (incl. renderer setting) should happen in setup()
    if (!this.applet.defaultSize && arguments.length == 2) {
        var [w, h] = arguments;
        this.applet.setPreferredSize(new java.awt.Dimension(w, h));
        this.applet.setSize(w, h);
        var frame = this.frame;
        swing.SwingUtilities.invokeAndWait(function() frame.pack());
    } else {
        if (arguments[2] == constants.OPENGL && this.suspendDuringResize !== false)
            this.suspendDuringResize = true;
        this.applet.size.apply(this.applet, arguments);
    }
}

Sketch.prototype.use = function(name) {
    // @@ add ability to add sketch-specific libraries
    var library = fs.join(module.directory, "..", "..", "..", "libraries", name, "library");
    for each (let x in fs.list(library))
        if (x.match(/\.jar$/))
            addToClasspath(fs.join(library, x));
    utils.addLibraryPath(library);
}
