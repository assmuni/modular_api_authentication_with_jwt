const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
    // console.log(req.headers);
    var token = req.headers.authorization;
    if (!token) {
        res.setatus(403).json({
            auth: false,
            message: 'no token provided'
        });
    } else {
        jwt.verify(token, config.secret, (err, data) => {
            if (!err) {
                req.id = data.id
                next();
            } else {
                res.status(403).json({
                    auth: false,
                    message: 'token not match'
                });
            }
        });
    }
}

module.exports = verifyToken;