const fs = require('fs');
const path = require('path');
const Validator = require('fastest-validator');
const UserRepository = require('../repository/UserRepository');
const { projectPath } = require('../app-config');

const APP_HOSTNAME = process.env.APP_HOSTNAME;
const validationChecker = new Validator();

const UserService = {
    async getUsersIndex(pageQuery, pageLimit){
        try {
            const page = parseInt(pageQuery) || 1;
            let limit = parseInt(pageLimit) || 10;
            const offset = (page - 1) * limit;

            if (limit > 100) {
                limit = 100;
            }
            
            const users = await UserRepository.getUsersIndex(offset, limit);

            const allUsers = users.map(row => ({
                id: row.id,
                email: row.email,
                gender: row.gender,
                role: row.role
            }));

            return allUsers;
        } catch (error) {
            throw new Error("Failed to fetch users");
        }
    },

    async getUsersById(id){
        try {
            const user = await UserRepository.getUsersById(id);

            if(user){
                return {
                    id: user.id,
                    email: user.email,
                    gender: user.gender,
                    role: user.role
                };
            }

            return user;
        } catch (error) {
            throw new Error(error);
        }
    },

    async updateUser(id, field){
        try {
            const {
                userId,
                authenticatedUserId
            } = id;
            
            const {
                email,
                gender,
                role,
                file
            } = field;

            console.log(file)
            let absoluteFilePath = file;
            let relativeFilePath;
            let fileLink;
            let staticLink;

            if(absoluteFilePath !== undefined){
                absoluteFilePath = file.path;
                relativeFilePath = path.relative(process.cwd(), absoluteFilePath);
                fileLink = relativeFilePath.replace(/\\/g, '/');
                staticLink = APP_HOSTNAME + fileLink;
            }

            if(parseInt(userId, 10) !== authenticatedUserId){
                if(absoluteFilePath !== undefined){
                    fs.unlinkSync(absoluteFilePath);
                }
                throw new Error('Unauthorized User');
            }

            const validate = validationChecker.validate({
                    email,
                    gender,
                    role
                }, this.userValidation
            );

            const user = await UserRepository.getUsersById(userId);

            if(validate.length || !user){
                if(absoluteFilePath !== undefined){
                    fs.unlinkSync(absoluteFilePath);
                }
                throw new Error(validate[0].message || 'Failed to update user info!');
            }

            if(user.avatar && fileLink !== undefined){
                let fullUrl = user.avatar;
                let baseUrl = APP_HOSTNAME;
                let fileUrl = `/${fullUrl.split(baseUrl)[1]}`;
                let projectUrl = fileUrl.replace(/\//g, '\\');

                fs.unlinkSync(projectPath+projectUrl);
            }

            const fieldValue = {
                email,
                gender,
                role,
                ...(absoluteFilePath !== undefined && { avatar: staticLink })
            }

            const updatedUser = await UserRepository.updateUser(userId, fieldValue);
            return updatedUser;
        } catch (error) {
            throw new Error(error);
        }
    },

    async deleteUser(id, role){
        try {
            console.log(role);
            if(!role || role !== "Administrator"){
                return false;
            }

            const userInfo = await UserRepository.getUsersById(id);

            if(!userInfo){
                return false;
            }

            if(userInfo.avatar){
                let fullUrl = userInfo.avatar;
                let baseUrl = APP_HOSTNAME;
                let fileUrl = `/${fullUrl.split(baseUrl)[1]}`;
                let projectUrl = fileUrl.replace(/\//g, '\\');
    
                fs.unlinkSync(projectPath+projectUrl);
            }

            const deletedUser = await UserRepository.deleteUser(id);

            return true;
        } catch (error) {
            throw new Error(error);
        }
    },

    userValidation: {
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

}

module.exports = UserService;