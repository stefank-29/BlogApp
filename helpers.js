const fs = require('fs');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = 'Blog app';

exports.menu = [
    { slug: '/blogs', title: 'Blogs', icon: 'blogs' },
    { slug: '/myBlogs', title: 'My Blogs', icon: 'myBlogs' },
    { slug: '/add', title: 'Add', icon: 'add' },
];
