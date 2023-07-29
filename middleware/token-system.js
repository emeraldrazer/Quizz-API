const jwt = require('jsonwebtoken')
const {key} = require('./key')

const generateToken = (object, expire) => {
    const token = jwt.sign({ signed: object }, key, { expiresIn: expire })
    return token;
};

const checkToken = (req, res, next) => {
    const token = req.params.token;
    if (!token) {
        return res.status(401).json({ err: true, msg: "No token provided" });
    }

    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(401).json({ err: true, msg: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = {checkToken, generateToken};