// rubricsList.js
const movies = require('./rubrics/movies');
const fatherfrost = require('./rubrics/fatherfrost');
const traditions = require('./rubrics/traditions');
const tree = require('./rubrics/tree');

const rubricsList = [movies, fatherfrost, traditions, tree];
if (typeof module !== 'undefined') module.exports = rubricsList;
