const { body } = require('express-validator');
const options = {
    minLength: 8,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
    minNumbers: 1
};

function test(pw) {
    const { validator } = body('password').isStrongPassword(options);
    const result = validator(pw);
    console.log(pw, result);
}

test('Newuser@123');
test('User@123');
