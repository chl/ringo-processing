var binary = require("binary");

var utils = require("./utils");
var constants = require("./constants");

var awt = java.awt;
var processing = Packages.processing;

export("Canvas", "ProcessingCanvas", "imageResponse");

function Canvas(w, h) {
    this.image = new awt.image.BufferedImage(
        w, h,
        awt.image.BufferedImage.TYPE_INT_ARGB
    );
    var g = this.graphics = this.image.createGraphics();
    g.setRenderingHint(
        awt.RenderingHints.KEY_ANTIALIASING,
        awt.RenderingHints.VALUE_ANTIALIAS_ON
    );
    g.setRenderingHint(
        awt.RenderingHints.KEY_RENDERING,
        awt.RenderingHints.VALUE_RENDER_QUALITY
    );
}

function ProcessingCanvas(w, h) {
    var g = this.graphics = new JavaAdapter(processing.core.PGraphicsJava2D, {
        // @@ figure out less convoluted procedure? 
        // esp: why doesn't a simple `textFont` adapter field access work?
        getFont: function() this.getClass().getField("textFont").get(this).getFont(),
        textAscent: function() this.g2.getFontMetrics(this.getFont()).getAscent(),
        textDescent: function() this.g2.getFontMetrics(this.getFont()).getDescent()
    });
    g.setPrimary(false);
    g.setSize(w, h);
    g.hint(constants.ENABLE_NATIVE_FONTS);
}

Object.defineProperty(ProcessingCanvas.prototype, "image", {
    get: function() this.graphics.getImage(),
    configurable: true
});

function imageResponse(image, format, contentType) {
    var format = format || "png";
    var contentType = contentType || "image/" + format;
    return {
        status: 200,
        headers: {"Content-type": contentType},
        body: [new binary.ByteArray(utils.imageAs(image, format))]
    };
}
