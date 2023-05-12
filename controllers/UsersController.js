let client;

const UsersController = {
    setClient(dbClient) {
        client = dbClient;
    },

    async get(req, res, next){
        client.query('SELECT * FROM users', function(err, result){
            if(err){
                return res.status(500).json({ error: 'An error occurred' });
            }
            return res.json({data: result.rows});
        });
    }
}

module.exports = UsersController;