var http     = require('http');
var fs       = require('fs');
var path     = require('path');
var Promise  = require('bluebird');
var mustache = require('mustache');

module.exports = VxHttp;

/**
 * @class VxHttp
 * @constructor
 * @param {Vx} vx context object
 */
function VxHttp(vx, config) {
  this.vx      = vx;
  this.namespaces = {};
  this.config     = config || {};
  this.port       = this.config.get('plugins.vx-http.port') || 2013;
}

/**
 * Initialize plugin
 */
VxHttp.prototype.init = function () {
  this.addNamespaceHandler('', this.onIndexRequest, this);
  this.indexTl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'index.tl')).toString();
};

/**
 * @property name
 */
VxHttp.prototype.name = require(path.resolve(__dirname, '..', 'package.json')).name;

/**
 * @property version
 */
VxHttp.prototype.version = require(path.resolve(__dirname, '..', 'package.json')).version;

/**
 * @property dependencies
 */
VxHttp.prototype.dependencies = require(path.resolve(__dirname, '..', 'package.json')).vxDependencies;

/**
 * Vx lifecycle stage: run
 */
VxHttp.prototype.run = function () {
  return new Promise(function (resolve, reject) {
    this.server = http.createServer(this.routeRequest.bind(this));
    this.vx.debug('Trying to listen on port %s', this.port);
    this.server.listen(this.port, function (err) {
      if (err) {
        reject(err);
      } else {
        this.vx.info('Listening on port %s', this.port);

        // do not resolve promise since this would indicate execution is complete
        // store resolve function so that we can end the plugin at a later point
        // if needed
        this.end = resolve;
      }
    }.bind(this));
  }.bind(this));
};

/**
 * Vx lifecycle stage: exit
 */
VxHttp.prototype.exit = function () {
  this.vx.debug('Exiting now.');
};

/**
 * @method routeRequest
 * @param {http.Request} request
 * @param {http.Response} response
 */
VxHttp.prototype.routeRequest = function (request, response) {
  var namespace, handlers, routePath, url;

  url          = request.url.split('/');
  namespace    = url[1].toLowerCase();
  routePath    = url.slice(2).join('/').toLowerCase();
  handlers     = this.namespaces[namespace];
  request.path = '/' + routePath;

  if (!handlers) {
    response.end('VxHttp: No handlers for namespace "' + namespace + '"');
  } else {
    handlers.forEach(function (handler) {
      handler.fn.call(handler.ctx, request, response);
    });
  }
};

/**
 * @method addNamespaceHandler
 */
VxHttp.prototype.addNamespaceHandler = function (namespace, fn, ctx) {
  var handlers = this.namespaces[namespace];

  if (!handlers) {
    handlers = this.namespaces[namespace] = [];
  }

  handlers.push({
    fn: fn,
    ctx: ctx
  });

  this.vx.debug('Added namespace handler for /' + namespace);
};

/**
 * @method onIndexRequest
 * @param {http.Request} request
 * @param {http.Response} response
 */
VxHttp.prototype.onIndexRequest = function (request, response) {
  var data = {
    namespaces: Object.keys(this.namespaces).map(function (namespace) {
        return {
          route: namespace,
          handlerCount: this.namespaces[namespace].length
        };
    }, this)
  };

  response.setHeader('Content-Type', 'text/html');
  response.write(mustache.render(this.indexTl, data));
  response.end();
};
