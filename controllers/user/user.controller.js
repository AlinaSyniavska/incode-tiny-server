const {userService, passwordService} = require("../../services");
const {userPresenter} = require("../../presenters");
const {roleEnum, roleDBEnum} = require("../../constants");

module.exports = {
    getAll: async (req, res, next) => {
        const {role, _id} = req.user;

        try {
            let users = [];
            let user = null;

            switch (role) {
                case roleEnum.ADMINISTRATOR:
                    users = await userService.findAll().exec();
                    break;
                case roleEnum.USER:
                    user = await userService.findOne({_id: _id}).exec();
                    users.push(user);
                    break;
                case roleDBEnum.BOSS:
                    users = await userService.findAll({idBoss: _id}).exec();
                    break;
                default:
                    user = await userService.findOne({_id: _id}).exec();
                    users.push(user);
            }

            const usersForResponse = users.map(user => userPresenter.userResponse(user));

            res.json({
                subordinates : usersForResponse,
            });
        } catch (e) {
            next(e);
        }
    },

    create: async (req, res, next) => {
        try {
            const {password} = req.body;

            const hashPassword = await passwordService.hashPassword(password);
            const newUser = await userService.createOne({...req.body, password: hashPassword});

            res.status(201).json(newUser);
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const {id} = req.params;
            let updatedUser;

            updatedUser = await userService.updateOne({_id: id}, req.body);


            res.status(201).json(updatedUser);
        } catch (e) {
            next(e);
        }
    },
};
