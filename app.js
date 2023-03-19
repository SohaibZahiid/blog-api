require("dotenv").config();

//Cors
const cors = require("cors");

const express = require("express");
const app = express();

//COOKIE PARSER
const cookieParser = require("cookie-parser");

//ASYNC ERROR HANDLER
require("express-async-errors");

//DB
const connectDB = require("./src/db/Connect");

//MIDLEWARES
const notFound = require("./src/middlewares/NotFound.middleware");
const errorHandler = require("./src/middlewares/ErrorHandler.middleware");

//ROUTES
const postRoutes = require("./src/routes/Post.route");
const userRoutes = require("./src/routes/User.route");
const authRoutes = require("./src/routes/Auth.route");

// // Add headers before the routes are defined
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
//     res.setHeader(
//         "Access-Control-Allow-Origin",
//         "https://blog-angular-nodejs.netlify.app"
//     );
//     // Request methods you wish to allow
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );
//     // Request headers you wish to allow
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "X-Requested-With,content-type"
//     );
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     // Pass to next layer of middleware
//     next();
// });
app.use(
    cors({
        origin: [
            "https://blog-angular-nodejs.netlify.app",
            "http://localhost:4200",
        ],
        credentials: true,
    })
);

//MIDDLEWARE
app.use(express.json({ limit: "5mb", extended: true }));
app.use(
    express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 })
);
app.use(express.text({ limit: "5mb" }));
app.use(cookieParser());

//ROUTES
app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

//CUSTOM ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
