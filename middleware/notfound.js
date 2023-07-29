const notFound = (req, res) => {
    res.status(404).json({err: true, msg: 'Route does not exist'});
}

module.exports = notFound;