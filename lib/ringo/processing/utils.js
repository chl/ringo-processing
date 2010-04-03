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
