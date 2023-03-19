require("dotenv").config();

const connectDB = require("./src/db/Connect");
const Post = require("./src/models/Post.model");
const User = require("./src/models/User.model");

const jsonPosts = require("./posts.json");
const jsonUsers = require("./users.json");


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Post.deleteMany();
        await User.deleteMany();
        await Post.create(jsonPosts);
        await User.create(jsonUsers);
        console.log("Successfully created posts");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();