const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }
});


const UserModel = model("User", UserSchema);

module.exports = UserModel;
