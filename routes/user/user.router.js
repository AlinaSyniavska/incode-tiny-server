const userRouter = require('express').Router();

const {commonMiddleware, userMiddleware, authMiddleware} = require("../../middlewares");
const {userValidator} = require("../../validators");
const {userController} = require("../../controllers");
const {roleDBEnum} = require("../../constants");

userRouter.get('/',
    authMiddleware.checkAccessToken,
    userController.getAll);

userRouter.post('/',
    commonMiddleware.isDataValid(userValidator.newUserValidator),
    userMiddleware.isAdminUniq,
    userMiddleware.isUserUniq,
    userMiddleware.isBossPresent,
    userController.create);


userRouter.patch('/:id',
    commonMiddleware.isIdValid,
    authMiddleware.checkAccessToken,
    commonMiddleware.verifyRoles(roleDBEnum.BOSS),
    commonMiddleware.isDataValid(userValidator.updateUserValidator),
    userMiddleware.isUserPresent,
    userController.update);


module.exports = userRouter;
