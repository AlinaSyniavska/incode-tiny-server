const userRouter = require('express').Router();

const { commonMiddleware, userMiddleware, authMiddleware } = require("../../middlewares");
const { userValidator } = require("../../validators");
const { userController } = require("../../controllers");
const { roleDBEnum } = require("../../constants");

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
    commonMiddleware.isDataValid(userValidator.updateUserValidator),
    userMiddleware.isUserPresent,
    authMiddleware.checkAccessToken,
    commonMiddleware.verifyRoles(roleDBEnum.BOSS),
    userMiddleware.isHisSubordinate,
    userMiddleware.isBossForUpdatePresent,
    userController.update);


module.exports = userRouter;
