const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
}

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'images');
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.replace(/\..+$/, '').split(' ').join('_');

//         const extension = MIME_TYPES[file.mimetype];
//         callback(null, name + Date.now() + '.' + extension);
//     }
// });
// cb(null, "public/images");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});
module.exports = multer({ storage }).single('image');
// Pour parser
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/auth", usersRouter);
app.use("/users", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

db.sequelize.sync().then(() => {
    app.listen(8800, () => {
        console.log("Server running on port 8800");
    });
});

// const express = require('express');
// // const bodyParser = require('body-parser');
// // const fs = require('fs');
// // const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const helmet = require('helmet');
// const dotenv = require('dotenv');
// dotenv.config();
// const app = express();
// const userRoute = require('./routes/users');
// const authRoute = require('./routes/auth');

// //middleware
// app.use(express.json());
// app.use(helmet());
// app.use(morgan("common"));
// // app.get("/", (rep, res) => {
// //     res.send("Welcome to homepage ");
// // });
// // app.get("/users", (rep, res) => {
// //     res.send("Welcome to user ");
// // });
// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);
// app.listen(8800, () => {
//     console.log("backend server is runing");
// });