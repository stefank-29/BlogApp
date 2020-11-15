const { Mongoose } = require('mongoose');
const { render } = require('pug');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const multer = require('multer');
const jimp = require('jimp'); // resize
const uuid = require('uuid'); // id for photos

const multerOptions = {
    storage: multer.memoryStorage(), // save file to memory
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/'); // does user upload picture or not
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype is not allowed!' }, false);
        }
    },
};

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'ADD BLOG' });
};

exports.upload = multer(multerOptions).single('photo'); // puts image to body.file (in memory)

//? resize and save to disk
exports.resize = async (req, res, next) => {
    if (!req.file) {
        next(); // skip to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`; // unique name of photo
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

exports.createStore = async (req, res) => {
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect('/');
};

exports.getBlogs = async (req, res) => {
    // query database for a list od blogs
    const blogs = await Blog.find();

    res.render('blogs', { title: 'Blogs', blogs });
};
