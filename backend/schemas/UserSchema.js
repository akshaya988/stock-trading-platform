const { Schema } = require("mongoose");

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    salt: { type: String, required: true, select: false },
    passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });

module.exports = { UserSchema };
