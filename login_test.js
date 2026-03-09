const uc = require('./controllers/users');
const mongoose = require('mongoose');

(async ()=>{
  await mongoose.connect('mongodb://localhost:27017/NNPTUD-C2');
  console.log('connected to mongo for test');
  let r1 = await uc.QueryByUserNameAndPassword('super','wrongpass');
  console.log('wrongpass result',r1);
  let r2 = await uc.QueryByUserNameAndPassword('super','P@ssw0rd1');
  console.log('rightpass result',!!r2);
  mongoose.disconnect();
})();
