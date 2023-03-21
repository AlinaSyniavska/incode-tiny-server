const { authValidator } = require("../../validators");
const { CustomError } = require("../../errors");
const { userService, tokenService } = require("../../services");
const { OAuth } = require("../../dataBase");
const { tokenTypeEnum } = require("../../constants");

module.exports = {
    isLoginBodyValid: (req, res, next) => {
        try {
            const {error, value} = authValidator.login.validate(req.body);

            if (error) {
                return next(new CustomError('Wrong email or password'));
            }

            req.body = value;
            next();
        } catch (e) {
            next(e);
        }
    },

    isUserPresentForAuth: async (req, res, next) => {
        try {
            const {email} = req.body;

            const userByEmail = await userService.findOne({email});

            if (!userByEmail) {
                return next(new CustomError('Wrong email or password'));
            }

            req.user = userByEmail;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAccessToken: async (req, res, next) => {
        try {
            const accessToken = req.headers.authorization || req.headers.Authorization;

            if (!accessToken) {
                return next(new CustomError('No token', 401));
            }

            tokenService.checkToken(accessToken);

            const tokenInfo = await OAuth.findOne({access_token: accessToken}).populate('userId');

            if (!tokenInfo) {
                return next(new CustomError('Token not valid', 401));
            }

            req.access_token = tokenInfo.access_token;
            req.user = tokenInfo.userId;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.headers.authorization || req.headers.Authorization;

            if (!refreshToken) {
                return next(new CustomError('No token', 401));
            }

            tokenService.checkToken(refreshToken, tokenTypeEnum.REFRESH);

            const tokenInfo = await OAuth.findOne({refresh_token: refreshToken}).populate('userId');

            if (!tokenInfo) {
                return next(new CustomError('Token not valid', 401));
            }

            req.tokenInfo = tokenInfo;

            next();
        } catch (e) {
            next(e);
        }
    },
};
