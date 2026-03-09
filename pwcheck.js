const validator = require('validator');
const options = {minLength:8,minLowercase:1,minSymbols:1,minUppercase:1,minNumbers:1};
console.log('Newuser@123 ->', validator.isStrongPassword('Newuser@123', options));
console.log('User@123 ->', validator.isStrongPassword('User@123', options));
