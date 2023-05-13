module.exports = (sequelize, DataTypes) => {
    const Movies = sequelize.define('Movies', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING
        },
        genres: {
            type: DataTypes.STRING
        },
        year: {
            type: DataTypes.STRING
        },
    },
    {
        tableName: "movies",
        timestamps: false
    });

    return Movies;
}