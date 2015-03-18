module.exports = function () {
  return {
    info: hmt.spy(),
    debug: hmt.spy(),
    error: hmt.spy()
  };
};
