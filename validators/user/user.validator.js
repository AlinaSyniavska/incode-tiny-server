const Joi = require('joi');

const {roleEnum} = require("../../constants");
const {emailValidator, passwordValidator} = require("../common/common.validator");

module.exports = {
  newUserValidator: Joi.object({
    email: emailValidator.required(),
    password: passwordValidator.required(),
    role: Joi.string().valid(...Object.values(roleEnum)).trim().required(),
    idBoss: Joi.string(),
  }),

  updateUserValidator: Joi.object({
    idBoss: Joi.string(),
  }),
};



