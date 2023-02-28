module.exports = {
    userResponse: (user) => {
        return {
            _id: user._id,
            email: user.email,
            role: user.role,
            idBoss: user.idBoss,
        }
    }
};

