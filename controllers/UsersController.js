const UserService = require('../services/UserService');
const { Users } = require('../models');

const UsersController = {
    async get(req, res, next){
        try{
            const { page, limit } = req.query;

            const users = await UserService.getUsersIndex(page, limit);

            res.json({data: users});
        } catch(error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    async getById(req, res, next){
        try {
            const { id } = req.params;
            const user = await UserService.getUsersById(id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({data: user});
        } catch(error) {
            return res.status(500).json({
                error: error.message
            });
        }
    },

    async update(req, res, next){
        try {
            const id = {
                userId: req.params.id,
                authenticatedUserId: req.user.id
            }
            const field = {
                email: req.body.email,
                gender: req.body.gender,
                role: req.body.role,
                file: req.file
            }

            const updatedUser = await UserService.updateUser(id, field);
            res.json({data: updatedUser});
        } catch (error){
            res.status(500).json({
                error: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const { role } = req.user;
            const { id } = req.params;
            const deletedUser = await UserService.deleteUser(id, role);

            if (!deletedUser) {
                return res.status(404).json({ error: 'Fail deleting user' });
            }

            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
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