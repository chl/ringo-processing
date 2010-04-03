var api = require("./processing/api");
var constants = require("./processing/constants");
var Sketch = exports.Sketch = require("./processing/sketch").Sketch;

for (let x in constants)
    exports[x] = constants[x];

exports.wire = function(object) {
    new Sketch().wire(object);
}
