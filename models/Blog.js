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
    if (!this.isModified('title')) {
        next(); // skipuj
        return;
    }
    this.slug = slug(this.title);
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i'); // case insensitive
    const storesWithSlugs = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlugs.length) {
        this.slug = `${this.slug}-${storesWithSlugs.length + 1}`; // dodeli mu se prvi sledeci broj
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
