let client;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { Users } = require('../models');
const { SECRET_KEY } = process.env;

const AuthControllers = {
    setClient(dbClient) {
        client = dbClient;
    },

    async signUp(req, res){
        try {
            const { email, gender, password, role } = req.body;
            const data = {
                email,
                gender,
                role,
                password: await bcrypt.hash(password, 5),
            };

            const user = await Users.create(data);

            if(user){
                let token = jwt.sign({ id: user.id }, SECRET_KEY, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);
                //send users details
                return res.status(201).send(user);
            } else {
                return res.status(409).send("Details are not correct");
            }
        } catch (error) {
            console.log(error);
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({
                where: {
                    email: email
                }
            });

            if(user){
                const passwordCheck = await bcrypt.compare(password, user.password);

                if(passwordCheck) {
                    let token = jwt.sign({ id: user.id }, SECRET_KEY, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                    });
            
                    //if password matches wit the one in the database
                    //go ahead and generate a cookie for the user
                    res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
                    console.log("user", JSON.stringify(user, null, 2));
                    console.log(token);
                    //send user data
                    return res.status(201).send(user);
                } else {
                    return res.status(401).send("Authentication failed");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = AuthControllers;