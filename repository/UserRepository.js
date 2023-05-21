let client;
const { Users } = require('../models');

const UserRepository = {
    setClient(dbClient) {
        client = dbClient;
    },

    async getUsersIndex(offset, limit){
        const result = await client.query('SELECT * FROM users OFFSET $1 LIMIT $2', [offset, limit]);
        const users = result.rows;
        return users;
    },

    async getUsersById(id){
        const user = await Users.findByPk(id);
        return user;
    },

    async updateUser(id, field){
        const updateUser = await Users.update(field, {
            where: {id}
        });

        const updatedUser = await Users.findByPk(id);
        return updatedUser;
    },

    async deleteUser(id){
        try{
            const deletedUser = await Users.destroy({
                where: {id}
            });
            return deletedUser;
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = UserRepository;