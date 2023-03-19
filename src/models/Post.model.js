const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    desc: {
        type: String,
        required: [true, "Please add a description"],
    },
    img: {
        type: String,
        required: [true, "Please add an image"],
    },
    cat: {
        type: String,
        required: [true, "Please add a category"],
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Post", postSchema);
