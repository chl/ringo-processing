exports.urls = [['/', 'actions']];
exports.app = require("ringo/webapp").handleRequest;
exports.middleware = [
    "ringo/middleware/error",
    "ringo/middleware/notfound"
];
