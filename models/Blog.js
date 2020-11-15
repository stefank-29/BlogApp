const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs'); // for URL

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Plese enter a blog title!',
    },
    slug: String,
    text: {
        type: String,
        trim: true,
        required: 'Please enter a blog text',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author',
    },
});

blogSchema.pre('save', async function (next) {
    // change slug if name is modified
    if (!this.isModified('name')) {
        next(); // skipuj
        return;
    }
    this.slug = slug(this.name);
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const blogsWithSlugs = await this.constructor.find({ slug: slugRegEx });
    if (blogsWithSlugs.lenght) {
        this.slug = `${this.slug}-${blogsWithSlugs.lenght + 1}`; // slugs with same name + 1
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
