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
    res.render('editBlog', { title: 'ADD BLOG' });
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
    //res.send(`${req.body.save} and ${req.body.delete}`)
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect('/');
};

exports.getBlogs = async (req, res) => {
    // query database for a list od blogs
    const blogs = await Blog.find();

    res.render('blogs', { title: 'Blogs', blogs });
};

exports.editBlog = async (req, res) => {
    // find blog by id
    const id = req.params.id;
    const blog = await Blog.findOne({ _id: id });
    // TODO check if they are owner of blog
    // render edit form
    res.render('editBlog', { title: 'Edit blog', blog });
};

exports.updateStore = async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findOneAndUpdate({ _id: id }, req.body, {
        new: true, // returns new store
        runValidators: true, // validators
    }).exec();
    res.redirect('/blogs');
};

exports.getBlogBySlug = async (req, res, next) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return next();
    res.render('blog', { title: 'Blog', blog });
};
