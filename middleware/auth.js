const express = require("express");
const jwt = require('jsonwebtoken');
const { Users } = require("../models");
const { SECRET_KEY } = process.env;

const saveUser = async(req, res, next) => {
    try {
        const userEmail = await Users.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (userEmail) {
            return res.json(409).send("email already taken");
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

const authenticate = async(req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authorization token not provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded; // Attach the decoded user information to the request object
        next();
    });
}

module.exports = { saveUser, authenticate };