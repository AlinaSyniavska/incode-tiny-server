const {userService} = require("../../services");
const {CustomError} = require("../../errors");
const {roleEnum} = require("../../constants");

module.exports = {
    isUserPresent: async (req, res, next) => {
        try {
            const {id} = req.params;

            const user = await userService.findOne({_id: id});

            if (!user) {
                return next(new CustomError(`User with id ${id} not found`, 404));
            }

            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    },

    isBossPresent: async (req, res, next) => {
        try {
            const {idBoss, role} = req.body;

            if(role === roleEnum.ADMINISTRATOR) {
                return next();
            }

            if(!idBoss) {
                const bossAdmin = await userService.findOne({role: roleEnum.ADMINISTRATOR}).exec();

                if (!bossAdmin) {
                    return next(new CustomError(`Administrator (top-most user) not found`, 404));
                }

                req.body.idBoss = bossAdmin._id;
                return next();
            }

            const boss = await userService.findOne({_id: idBoss});

            if (!boss) {
                return next(new CustomError(`Boss with id ${idBoss} not found`, 404));
            }

            await userService.updateOne({_id: idBoss}, {role: roleEnum.BOSS});

            next();
        } catch (e) {
            next(e);
        }
    },

    isAdminUniq: async (req, res, next) => {
        try {
            const {role} = req.body;

            if(role !== roleEnum.ADMINISTRATOR) {
                return next();
            }

            const user = await userService.findOne({role});

            if (user) {
                return next(new CustomError(`User with role ${roleEnum.ADMINISTRATOR} is exist`, 409));
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserUniq: async (req, res, next) => {
        try {
            const {email} = req.body;

            const user = await userService.findOne({email});

            if (user) {
                return next(new CustomError(`User with email ${email} is exist`, 409));
            }

            next();
        } catch (e) {
            next(e);
        }
    },

};
