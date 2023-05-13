let client;
const { Users } = require('../models');
const Validator = require('fastest-validator');
const validationChecker = new Validator();

const UsersController = {
    setClient(dbClient) {
        client = dbClient;
    },

    async get(req, res, next){
        try{
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            // Validate and limit the maximum value of 'limit' if needed
            if (limit > 100) {
                limit = 100; // Set a maximum limit of 100
            }

            const result = await client.query('SELECT * FROM users OFFSET $1 LIMIT $2', [offset, limit]);

            const getUsers = result.rows.map(row => ({
                id: row.id,
                email: row.email,
                gender: row.gender,
                role: row.role
            }));

            res.json({data: getUsers});
        } catch(error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getById(req, res, next){
        try {
            const { id } = req.params;
            const user = await Users.findByPk(id);
            if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }
            return res.json({
                id: user.id,
                email: user.email,
                gender: user.gender,
                role: user.role,
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    },

    async update(req, res, next){
        const userId = req.params.id;
        const validate = validationChecker.validate(req.body, userValidation);
        if(validate.length){
            return res.status(400).json(validate);
        }

        const {
            email,
            gender,
            role
        } = req.body;

        try {
            const updateUser = await Users.update({
                email,
                gender,
                role
            }, {
                where: {id: userId}
            });

            const updatedUser = await Users.findByPk(userId);
            res.json(updatedUser);
        } catch (error){
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async delete(req, res) {
        const { id } = req.params;
      
        try {
            // Find the user by ID
            const user = await Users.findByPk(id);
        
            // Check if the User exists
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        
            // Delete the user
            await user.destroy();
        
            // Return a success response
            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
}

const userValidation = {
    email: {
        type: "email",
        min: 1,
        max: 255,
        optional: false
    },
    gender: {
        type: "enum",
        values: ['Male', 'Female'],
        min: 1,
        max: 50,
        optional: false
    },
    role: {
        type: "string",
        min: 1,
        max: 50,
        optional: false
    },
}

module.exports = UsersController;