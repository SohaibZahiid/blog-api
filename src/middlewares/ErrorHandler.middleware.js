const errorHandler = async (err, req, res, next) => {
    return res.status(500).json('Something went wrong, please try again');
}

module.exports = errorHandler;