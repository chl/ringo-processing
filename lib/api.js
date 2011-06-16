addToClasspath(module.resolve("../jars/applet.jar"));
addToClasspath(module.resolve("../jars/core.jar"));

include("./utils");

exports.methods = [
    // Structure
    // "setup", "draw" // @@ events
    "redraw", "size", "delay", "exit", "destroy", "loop", "noLoop", "pushStyle", "popStyle",
    // Environment
    "cursor", "noCursor",
    // 2D Primitives
    "arc", "ellipse", "line", "point", "quad", "rect", "triangle",
    // Curves
    "bezier", "bezierDetail", "bezierPoint", "bezierTangent",
    "curve", "curveDetail", "curvePoint", "curveTangent", "curveTightness",
    // 3D Primitives
    "box", "sphere", "sphereDetail",
    // Attributes
    "smooth", "noSmooth",
    "rectMode", "ellipseMode",
    "strokeCap", "strokeJoin", "strokeWeight",
    // Vertex
    "beginShape", "endShape",
    "vertex", "bezierVertex", "curveVertex",
    "texture", "textureMode",
    // Loading & Displaying
    "loadShape", "shape", "shapeMode",
    // File I/O
    "createInput", "createInputRaw", "createReader", "createOutput", "createWriter", 
    "open", "selectFolder", "selectInput", "selectOutput",
    "loadBytes", "loadStrings", "saveBytes", "saveStream", "saveStrings",
    "beginRaw", "endRaw", "beginRecord", "endRecord",
    // Web
    "link", "param", "status",
    // Time & Date
    "year", "month", "day", "hour", "minute", "second", "millis",
    // Text Area Output
    // "print", "println", @@
    // Image Output
    "save", "saveFrame",
    // Transform
    "applyMatrix", "popMatrix", "pushMatrix", "resetMatrix", "printMatrix",
    "rotate", "rotateX", "rotateY", "rotateZ",
    "scale", "translate",
    // Lights
    "ambientLight", "directionalLight", "pointLight", "spotLight",
    "lightFalloff", "lightSpecular",
    "lights", "noLights",
    "normal",
    // Camera
    "camera", "beginCamera", "endCamera", "printCamera", "printProjection", 
    "frustum", "ortho", "perspective",
    // Coordinates
    "modelX", "modelY", "modelZ", "screenX", "screenY", "screenZ",
    // Material Properties
    "ambient", "emissive", "shininess", "specular",
    // Color
    "background", "colorMode", "fill", "noFill", "stroke", "noStroke",
    "color", "blendColor","lerpColor",
    "red", "green", "blue", "alpha",
    "hue", "saturation", "brightness",
    // Image
    "createImage", "loadImage", "requestImage",
    "image", "imageMode", "tint", "noTint",
    // Pixels
    "get", "set", "blend", "copy", "filter", "mask", "loadPixels", "updatePixels",
    // Rendering
    "createGraphics", "hint",
    // Fonts & Text
    "createFont", "loadFont",
    "text", "textFont", "textAlign", "textLeading", "textMode", "textSize", "textWidth", "textAscent", "textDescent",
    // Static Methods
    // Conversion
    "byte", "char", "int", "float", "str", // wanted?
    "binary", "unbinary", "hex", "unhex",
    // String Functions
    "join", "match", "matchAll", "nf", "nfc", "nfp", "nfs", "split", "splitTokens", "trim",
    // Array Functions
    "arrayCopy", "append", "concat", "expand", "shorten", "splice", "subset", "sort", "reverse",
    // Calculation
    "abs", "floor", "ceil", "exp", "log", "round", "sqrt", "pow", // also in JavaScript
    "constrain", "dist", "lerp", "mag", "map", "max", "min", "norm", "sq",
    // Trigonometry
    "cos", "sin", "tan", "acos", "asin", "atan", "atan2", "degrees", "radians",
    // Random
    "noise", "noiseDetail", "noiseSeed",
    "random", "randomSeed",
    // Misc
    "createPath"
];

exports.properties = [
    "width", "height", "screen",
    "frameCount",
    "focused", "online",
    "mouseX", "mouseY",
    "pmouseX", "pmouseY",
    "mouseButton",
    "key", "keyCode",
    "mouseEvent", "keyEvent",
    "pixels",
    {
        name: "frameRate",
        get: function() this.applet.frameRate,
        set: function(x) {this.applet["frameRate(float)"](x);},
        configurable: true
    },
    {
        name: "isMousePressed",
        get: function() this.applet.mousePressed == true,
        configurable: true
    },
    {
        name: "isKeyPressed",
        get: function() this.applet.keyPressed == true,
        configurable: true
    },
];

exports.nameClashes = [  
    "frameRate", "mousePressed", "keyPressed"
];

exports.mouseEvents = [
    "mouseMoved",
    "mouseDragged",
    "mousePressed",
    "mouseReleased",
    "mouseClicked",
    "mouseEntered", // @@
    "mouseExited" // @@
];

exports.keyEvents = [
    "keyPressed",
    "keyReleased",
    "keyTyped"
];

exports.focusEvents = [
    "focusGained",
    "focusLost"
];

exports.systemEvents = [
    "draw", "setup"
];

exports.additionalEvents = [
    "sketchResize", "sketchResized"
];

exports.events = flatten([
    exports.mouseEvents,
    exports.keyEvents,
    exports.focusEvents,
    exports.systemEvents,
    exports.additionalEvents
]);

exports.classes = {
    BufferedReader: "java.io.BufferedReader",
    PrintWriter:    "java.io.PrintWriter",
    XMLElement:     "processing.xml.XMLElement",
    PImage:         "processing.core.PImage",
    PGraphics:      "processing.core.PGraphics",
    PShape:         "processing.core.PShape",
    PVector:        "processing.core.PVector"
};
