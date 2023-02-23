const {Schema, model} = require('mongoose');
const {roleEnum} = require("../constants");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: roleEnum.USER
    },
    idBoss: {
        type: Schema.Types.ObjectId, ref: 'user'
    },

}, {timestamps: true});

module.exports = model('user', UserSchema);
