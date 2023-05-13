module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true, //checks for email format
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING
        },
    }, {
        tableName: "users",
        timestamps: false
    })
    return Users
}