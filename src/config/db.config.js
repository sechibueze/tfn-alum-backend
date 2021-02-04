const mongoose =  require('mongoose');

module.exports = function () {
    const { NODE_ENV, MONGODBURI } = process.env;
    const uri = NODE_ENV === 'production' ? MONGODBURI : 'mongodb://localhost:27017/alumni-hub';
    return mongoose.connect(uri, { useNewUrlParser: true})
}