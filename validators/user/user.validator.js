const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { roleEnum } = require("../../constants");
const { emailValidator, passwordValidator } = require("../common/common.validator");

module.exports = {
  newUserValidator: Joi.object({
    email: emailValidator.required(),
    password: passwordValidator.required(),
    role: Joi.string().valid(...Object.values(roleEnum)).trim(),
    idBoss: Joi.string(),
  }),

  updateUserValidator: Joi.object({
    idUser: Joi.objectId(),
    idBoss: Joi.objectId(),
  }),
};



