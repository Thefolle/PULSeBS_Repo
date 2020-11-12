const express = require('express');

const pulsebsDAO = require('./pulsebsDAO');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 900; //seconds

// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

//Initializing server
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Authentication endpoint
// TESTED
app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    pulsebsDAO.getUserByEmail(email)
        .then((user) => {
            if (user === undefined) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }]
                });
            } else {
                if (!pulsebsDAO.checkPassword(user, password)) {
                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                    });
                } else {
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({ userID: user.id }, jwtSecret, { expiresIn: expireTime });
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                    res.json({ userID: user.id, name: user.name, type: user.type });
                }
            }
        }).catch(

            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            (err) => {
                console.log(err);
                new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj))
            }
        );
});

app.use(cookieParser());

/*
 * Unprotected APIs
 */

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});



app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

/*
 * Protected APIs
 */

const dbError = {
    error: "db",
    description: "Database error"
}

const authError = {
    error: "auth",
    description: "User not authenticated"
}

const validError = {
    error: "validation",
    description: "Data not valid"
}


app.listen(port, () => console.log(`REST API server listening at http://localhost:${port}`));
