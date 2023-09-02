const path = require('path');

module.exports = {
    mode: 'development', // or 'production'
    entry: './public/script/index.js', // Entry point of your client-side code
    output: {
        filename: 'bundle.js', // Output bundle file
        path: path.resolve(__dirname, 'public/dist'), // Output directory
    },
};