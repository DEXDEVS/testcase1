const {mongoose} = require("mongoose");

const peopleSchema = new mongoose.Schema(
    {
        name: {type: String, lowercase: true, trim: true},
        email: {
            type: String,
            unique: true,
            required: [true, "Login email is required"],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        avatar: {type: String},
        role: {type: String, enum: ["Admin", "SuperAdmin"],default:"Admin", required: true},
    },
    {timestamps: true, versionKey: false}
);

const People = mongoose.model("People", peopleSchema);

module.exports = People;
