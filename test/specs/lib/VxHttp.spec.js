var VxHttp = hmt.lib('VxHttp');

describe('VxHttp', function () {
  var plugin;

  before(function () {
    var vx = hmt.mock('vx')();
    var config = hmt.mock('config')();

    plugin = new VxHttp(vx, config);
  });

  describe('#addNamespaceHandler', function () {
    it('should route request', function (done) {
      plugin.addNamespaceHandler('sample', function (request, response) {
        hmt.assert.equal(this.name, 'myctx');
        done();
      }, { name: 'myctx' });

      plugin.routeRequest({ url: '/sample' }, { end: hmt.spy() });
    });
  });
});
