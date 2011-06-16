var constants = require("./lib/constants");
var Sketch = exports.Sketch = require("./lib/sketch").Sketch;

for (let x in constants)
    exports[x] = constants[x];

exports.wire = function(object) {
    new Sketch().wire(object);
};
