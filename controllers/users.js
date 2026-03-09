let userModel = require('../schemas/users')
module.exports = {
    CreateAnUser: async function (username, password, email, role,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save();
        return newUser;
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        // verify password against hash
        let bcrypt = require('bcrypt');
        let match = bcrypt.compareSync(password, getUser.password);
        if (!match) {
            return false;
        }
        return getUser;
    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted:false
        })
    },

    /**
     * Change a user's password after verifying the old password.
     * @param {string} userId
     * @param {string} oldPassword
     * @param {string} newPassword
     */
    ChangePassword: async function(userId, oldPassword, newPassword) {
        let user = await userModel.findById(userId);
        if (!user) {
            throw new Error('user not found');
        }
        let bcrypt = require('bcrypt');
        let match = bcrypt.compareSync(oldPassword, user.password);
        if (!match) {
            throw new Error('old password incorrect');
        }
        user.password = newPassword; // pre('save') hook will hash it
        await user.save();
        return user;
    }
}