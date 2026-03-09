var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
let jwt = require('jsonwebtoken')
let { checkLogin } = require('../utils/authHandler.js')
let { changePasswordValidator, validateResult } = require('../utils/validatorHandler');

/* GET home page. */
//localhost:3000
router.post('/register', async function (req, res, next) {
    // use provided role id instead of hard-coded value
    let roleId = req.body.role;
    if (!roleId) {
        return res.status(400).send({ message: 'role id is required' });
    }
    try {
        let newUser = await userController.CreateAnUser(
            req.body.username,
            req.body.password,
            req.body.email,
            roleId
        )
        res.send({
            message: "dang ki thanh cong",
            user: newUser
        })
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});
router.post('/login', async function (req, res, next) {
    let result = await userController.QueryByUserNameAndPassword(
        req.body.username, req.body.password
    );
    if (!result) {
        return res.status(401).send({ message: 'invalid username or password' });
    }
    let token = jwt.sign({
        id: result.id
    }, 'secret', {
        expiresIn:'1h'
    })
    res.send(token)
});
router.get('/me', checkLogin,async function(req,res,next){
    console.log(req.userId);
    let getUser = await userController.FindUserById(req.userId);
    res.send(getUser);
})

// self-service change password
// normalize keys in case client uses lowercase names
router.post('/change-password',
    function (req, res, next) {
        if (req.body.oldpassword && !req.body.oldPassword) {
            req.body.oldPassword = req.body.oldpassword;
        }
        if (req.body.newpassword && !req.body.newPassword) {
            req.body.newPassword = req.body.newpassword;
        }
        next();
    },
    checkLogin,
    changePasswordValidator,
    validateResult,
    async function (req, res, next) {
        try {
            await userController.ChangePassword(
                req.userId,
                req.body.oldPassword,
                req.body.newPassword
            );
            res.send({ message: 'password changed' });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
);


module.exports = router;
