const {passwordService, tokenService} = require("../../services");
const {OAuth} = require("../../dataBase");


module.exports = {
    login: async (req, res, next) => {
        try {
            const {password: hashPassword, _id, role} = req.user;
            const {password} = req.body;

            await passwordService.comparePassword(hashPassword, password);

            const userRole = Object.values(role);
            const tokens = tokenService.generateAuthTokens({
                "UserInfo": {
                    "userId": _id,
                    "role": userRole
                }
            });

            await OAuth.create({
                userId: _id,
                ...tokens,
            });

            res.json({
                user: req.user,
                ...tokens,
            });
        } catch (e) {
            next(e);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const {userId, refresh_token} = req.tokenInfo;
            const {userId: userIdPayload} = req.userId;
            const {role} = req.role;

            await OAuth.deleteOne({refresh_token});

            const tokens = tokenService.generateAuthTokens(({
                "UserInfo": {
                    "userId": userIdPayload,
                    "role": role
                }
            }));

            await OAuth.create({
                userId,
                ...tokens,
            });

            res.json(tokens);
        } catch (e) {
            return next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            // const { access_token } = req;
            // const { email, name } = user;
            const {access_token} = req;

            await OAuth.deleteOne({access_token});

            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },

    logoutAllDevices: async (req, res, next) => {
        try {
            // const { _id, email, name } = req.user;
            const {_id} = req.user;

            const {deletedCount} = await OAuth.deleteMany({userId: _id});
            console.log(deletedCount);

            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },
};
