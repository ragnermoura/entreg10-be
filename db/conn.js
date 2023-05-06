const { Sequelize } = require('sequelize');
require('dotenv').config()

const db_user = process.env.MYSQL_USER;
const db_password = process.env.MYSQL_PASSWORD;
const db_name = process.env.MYSQL_DATABASE;
const db_host = process.env.MYSQL_HOST;


const sequelize = new Sequelize(db_name, db_user,  db_password,{
    host: db_host,
    dialect: 'mysql'
})

try{
    sequelize.authenticate()
    console.log('Conectado com sucesso')
} catch(err) {
    console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize