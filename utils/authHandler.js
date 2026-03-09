let jwt = require('jsonwebtoken')
let userModel = require('../schemas/users')

module.exports = {
    checkLogin: async function (req, res, next) {
        let token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer")) {
            res.status(403).send("ban chua dang nhap")
            return;
        }
        token = token.split(' ')[1];
        let result;
        try {
            result = jwt.verify(token, 'secret');
        } catch (e) {
            res.status(403).send("ban chua dang nhap");
            return;
        }
        if (result && result.exp * 1000 > Date.now()) {
            req.userId = result.id;
            next();
        } else {
            res.status(403).send("ban chua dang nhap")
        }
    },

    /**
     * Returns an express middleware that verifies the logged-in user's role.
     * @param {string|string[]} allowedRoles - role name or array of names permitted.
     */
    checkRole: function (allowedRoles) {
        if (typeof allowedRoles === 'string') {
            allowedRoles = [allowedRoles];
        }
        return async function (req, res, next) {
            // make sure login has already been checked
            if (!req.userId) {
                res.status(401).send('unauthorized');
                return;
            }
            try {
                let user = await userModel.findById(req.userId).populate('role');
                if (!user || !user.role) {
                    res.status(401).send('unauthorized');
                    return;
                }
                let roleName = user.role.name;
                if (allowedRoles.includes(roleName)) {
                    // attach role to request for downstream handlers if needed
                    req.userRole = roleName;
                    next();
                } else {
                    res.status(403).send('forbidden');
                }
            } catch (err) {
                res.status(500).send('server error');
            }
        };
    }
}