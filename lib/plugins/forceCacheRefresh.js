module.exports = {
  init: () => console.log('using force cache refresh plugin'),

  requestReceived: (req, res, next) => {
    const query = new URLSearchParams(req.prerender.url.split('?')[1])
    if (query.get('__refresh') === 'true') req.refresh = true
    next()
  }
}
