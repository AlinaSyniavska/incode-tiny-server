const jwt = require('jsonwebtoken');

const {config} = require("../../configs");
const {CustomError} = require("../../errors");
const {tokenTypeEnum} = require("../../constants");

module.exports = {
    generateAuthTokens: (payload = {}) => {
        const access_token = jwt.sign(payload, config.ACCESS_TOKEN, {expiresIn: '24h'});
        const refresh_token = jwt.sign(payload, config.REFRESH_TOKEN, {expiresIn: '30d'});

        return {
            access_token,
            refresh_token
        }
    },

    checkToken: (req, token = '', tokenType = tokenTypeEnum.ACCESS) => {
        try {
            let secret;

            if (tokenType === tokenTypeEnum.ACCESS) secret = config.ACCESS_TOKEN;
            if (tokenType === tokenTypeEnum.REFRESH) secret = config.REFRESH_TOKEN;

            return jwt.verify(
                token,
                secret,
                (err, decoded) => {
                    if (err) throw new CustomError('Token not valid', 401);

                    req.role = decoded.UserInfo.role;
                }
            );
        } catch (e) {
            throw new CustomError('Token not valid', 401);
        }
    },

};
