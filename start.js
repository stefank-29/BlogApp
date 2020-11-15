const mongoose = require('mongoose');

// import enviromnet varibles from variables.env
require('dotenv').config({ path: 'variables.env' }); // to access config via proces.env

// Connect to database
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.error(`Connection error: ${err.message}`);
});

// import all models
require('./models/Blog');

// run server
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running => PORT ${server.address().port}`);
});
