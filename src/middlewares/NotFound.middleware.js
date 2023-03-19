const notFound = (req, res, next) => res.status(404).json('Route not found');

module.exports = notFound;