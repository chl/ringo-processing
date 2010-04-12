var utils = require("ringo/processing/utils");

var {Response} = require("ringo/webapp/response");
var {imageResponse, Canvas, ProcessingCanvas} = require("ringo/processing/web");

exports.index = function(req) {
    var link = function(x, y) <a href={x}>{y || x}</a>.toXMLString();
    return new Response(
        link("g2"),
        "<br />",
        link("p5"), "/", link("p5text", "text")
    );
};

exports.g2 = function(req) {
    var canvas = new Canvas(100, 100);
    var g = canvas.graphics;
    g.setStroke(new java.awt.BasicStroke(5));
    g.setColor(java.awt.Color.red);
    g.drawLine(10, 10, 90, 90);
    g.drawLine(10, 90, 90, 10);
    return imageResponse(canvas.image);
};

exports.p5 = function(req) {
    var canvas = new ProcessingCanvas(100, 100);
    var g = canvas.graphics;
    g.beginDraw();
    g.background(255);
    g.stroke(0, 200, 0);
    g.strokeWeight(5);
    g.line(10, 10, 90, 90);
    g.line(10, 90, 90, 10);
    g.endDraw();
    return imageResponse(canvas.image);
};

exports.p5text = function(req) {
    var canvas = new ProcessingCanvas(800, 50);
    var helvetica = utils.createPFont("Helvetica");
    var x = req.params.text || "ringo-processing";
    with (canvas.graphics) {
        beginDraw();
        noStroke();
        textFont(helvetica);
        textSize(24);
        fill(200, 0, 0, 20);
        rect(0, 32, width, -textAscent());
        fill(0, 200, 0, 20);
        rect(0, 32, width, textDescent());
        fill(0);
        text(x, 0, 32);
        stroke(0, 50);
        line(0, 32, width, 32);
        line(textWidth(x), 0, textWidth(x), height);
        endDraw();
    }
    return imageResponse(canvas.image);
};
