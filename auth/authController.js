const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

var User = require('../user/User');

var verifyToken = require('./verifyToken');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/register', (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: hashedPassword
    // }, (err, user) => {
    //     if (err) return res.status(500).json({message: err.message});
    //     // create a token
    //     var token = jwt.sign({ id: user._id }, config.secret, {expiresIn: '24h'});
    //     res.status(200).send({ auth: true, token: token });
    // }); 
    
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }).then((data) => {
        var token = jwt.sign({ id: data._id }, config.secret, {expiresIn: '24h'});
        res.status(200).send({ auth: true, token: token });
    }).catch((err) => {
        res.status(500).json({message: err.message});
    }); 
});

// router.get('/me', (req, res, next) => {
//     var token = req.headers.authorization;

//     if (!token) return res.status(401).send({
//         auth: false,
//         message: 'no token provided'
//     });

//     jwt.verify(token, config.secret, (err, decoded) => {
//         if (err) {
//             res.status(500).send({
//                 auth: false,
//                 message: 'failed to authenticate token'
//             });
//         } else {
//             User.findById(decoded.id, {password: 0})    // THIS THING CALL PROJECTION
//                 .then(data => {
//                     res.status(200).send(data);
//                     // next(data);
//                 })
//                 .catch(err => res.status(500).send(err));
//         }
//     });
// });

router.get('/me', verifyToken, (req, res) => {
    User.findById(req.id, {password: 0})
        .then(data => {
            res.status(200).json({
                data: data
            });
        })
        .catch(err => res.status(500).send(err.message));
});

// router.use((data, req, res, next) => {
//     res.status(200).send(data);
// });


router.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
        .then((data) => {
            if (!data) {
                res.status(402).json({
                    message: 'Email not found!'
                });
            } else {
                const checkCredentials = bcrypt.compareSync(req.body.password, data.password);
                if (checkCredentials) {
                    var token = jwt.sign({id: data._id}, config.secret, {expiresIn: '24h'});
                    res.status(201).json({
                        auth: true,
                        token: token
                    });
                } else {
                    res.status(401).json({
                        auth: false,
                        token: null
                    });
                }
                // res.status(200).json(data);
            }
        })
        .catch((err) => res.status(500).send(err.message));
});


router.get('/logout', (req, res) => {
    res.status(200).json({
        auth: false,
        token: null
    });

    // DESTROY SESSION ON CLIENT
});

module.exports = router;