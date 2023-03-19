const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    img: {
        type: String,
        default: "https://images.unsplash.com/placeholder-avatars/extra-large.jpg?dpr=1&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],
});

module.exports = mongoose.model("User", UserSchema);
