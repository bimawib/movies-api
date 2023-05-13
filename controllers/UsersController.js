let client;
const {Users} = require('../models');

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

            const getUsers = result.rows;
            res.json({data: getUsers});
        } catch(error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = UsersController;