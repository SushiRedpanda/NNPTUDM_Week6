try {
  console.log('loading routes/users');
  let users = require('./routes/users');
  console.log('loaded users, exports =', users);
  console.log('router stack:');
  users.stack.forEach((layer, idx) => {
    console.log(idx, layer.route ? layer.route.path : '<none>', layer.name);
    if (layer.route) {
      layer.route.stack.forEach((mw, midx) => {
        console.log('  mw', midx, mw.name);
      });
    }
  });
} catch (e) {
  console.error('error requiring users:', e);
}
