const { DataTypes } = require('sequelize')

const db = require('../db/conn')
const Tb001_user = require('./User')

const Tb006_dados_entregador = db.define('tb006_dados_entregador',{

    id_entregador:{
        type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
    },
    cep: {
        type: DataTypes.STRING(45),
        allowNull: true,
        require: false,
    },
    telefone1: {
        type: DataTypes.STRING(45),
        allowNull: true,
        require: false,
    },
    telefone2: {
        type: DataTypes.STRING(45),
        allowNull: true,
        require: false,
    },
    cnh: {
        type: DataTypes.STRING(45),
        allowNull: true,
        require: false,
    },
    cpf: {
        type: DataTypes.STRING(45),
        allowNull: true,
        require: false,
    },
    pix: {
        type: DataTypes.STRING(255),
        allowNull: false,

        require: true,
    },
    marca_moto: {
        type: DataTypes.STRING(100),
        allowNull: true,

        require: false,
    },
    modelo_moto: {
        type: DataTypes.STRING(100),
        allowNull: true,

        require: false,
    },
    ano_moto: {
        type: DataTypes.STRING(100),
        allowNull: true,

        require: false,
    },
   

}, {timestamps: false,
     freezeTableName: true})


Tb006_dados_entregador.belongsTo(
    Tb001_user,
    {
        foreignKey: 'id_user',
        constraints: true,
        foreignKeyConstraint: 'id_user'
    }
)

module.exports = Tb006_dados_entregador