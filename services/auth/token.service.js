const jwt = require('jsonwebtoken');

const {config} = require("../../configs");
const {CustomError} = require("../../errors");
const {tokenTypeEnum, emailActionEnum} = require("../../constants");

module.exports = {
    generateAuthTokens: (payload = {}) => {
        const access_token = jwt.sign(payload, config.ACCESS_TOKEN, {expiresIn: '24h'});
        const refresh_token = jwt.sign(payload, config.REFRESH_TOKEN, {expiresIn: '30d'});

        return {
            access_token,
            refresh_token
        }
    },

    generateActionToken: (actionType, payload = {}) => {
        let secretWord = 'secretWordForMakeupShop';
        let expiresIn = '7d';

        switch (actionType) {
            case emailActionEnum.FORGOT_PASSWORD:
                secretWord = config.FORGOT_PASS_ACTION_SECRET;
                break;

            default:
                throw new CustomError('Wrong action type', 500);
        }

        return jwt.sign(payload, secretWord, {expiresIn});
    },

    checkToken: (token = '', tokenType = tokenTypeEnum.ACCESS) => {
        try {
            let secret;

            if (tokenType === tokenTypeEnum.ACCESS) secret = config.ACCESS_TOKEN;
            if (tokenType === tokenTypeEnum.REFRESH) secret = config.REFRESH_TOKEN;

            return jwt.verify(token, secret);
        } catch (e) {
            throw new CustomError('Token not valid', 401);
        }
    },

};
