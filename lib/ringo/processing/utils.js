var flattened = exports.flattened = function(iterables) {
    for each (let iterable in iterables)
        for each (let x in iterable)
            yield x;
};

var array = exports.array = function(iterable) {
    var result = [];
    for each (let x in iterable)
        result.push(x);
    return result;
};

var flatten = exports.flatten = function(x) array(flattened(x));

var addLibraryPath = exports.addLibraryPath = function(path) {
    // from ruby-processing
    var libraryPath = java.lang.System.getProperty("java.library.path");
    java.lang.System.setProperty("java.library.path", [libraryPath, path].join(java.io.File.pathSeparator));
    // force re-initialization of both sys_paths and usr_paths
    var field = java.lang.Class.forName("java.lang.ClassLoader").getDeclaredField("sys_paths");
    field.accessible = true;
    field.set(null, null);
};

var imageFormatBytes = exports.imageFormatBytes = function(image, format) {
    var out = new java.io.ByteArrayOutputStream();
    Packages.javax.imageio.ImageIO.write(image, format, out);
    return out.toByteArray();
};

var fontFromFile = exports.fontFromFile = function(path) {
    var input = new java.io.FileInputStream(path);
    var font = java.awt.Font.createFont(java.awt.Font.TRUETYPE_FONT, input);
    input.close();
    return font;
};

var systemFont = exports.systemFont = function(name) {
    return java.awt.Font.decode(name);
};

// Replicated from PApplet, because it's useful for web apps too.
// Didn't implement the OS X name resolution workaround, as decode seems to work fine.
var createPFont = exports.createPFont = function(fontOrName, size, smooth, charset) {
    var font, PFont = Packages.processing.core.PFont;
    if (fontOrName instanceof java.awt.Font) {
        font = fontOrName;
    } else {
        var lower = new java.lang.String(fontOrName.toLowerCase());
        font = (lower.endsWith(".otf") || lower.endsWith(".ttf"))
            ? fontFromFile(fontOrName)
            : systemFont(fontOrName)
        ;
    }
    return new PFont(font.deriveFont(size || 12), smooth !== false, charset || PFont.CHARSET);
};
