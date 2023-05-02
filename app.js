const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')

require('dotenv').config();

const rotaUsuarios = require('./routes/usuarios')
const rotaStatus = require('./routes/status')
const rotaNivel = require('./routes/nivel')
const rotaPerfil = require('./routes/perfil')
const rotaSegmento = require('./routes/segmento')
const rotaPedido = require('./routes/pedido')
const rotaEntregador = require('./routes/entregador')
const rotaClientes = require('./routes/clientes')


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Credentials", "true")
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS')
        return res.status(200).send({})
    }
    next();
})

app.use('/api/usuarios', rotaUsuarios);
app.use('/api/perfil', rotaPerfil);
app.use('/api/status', rotaStatus);
app.use('/api/nivel', rotaNivel);
app.use('/api/segmento', rotaSegmento);
app.use('/api/pedido', rotaPedido);
app.use('/api/entregador', rotaEntregador);
app.use('/api/clientes', rotaClientes);

app.get('/api/security', (req,res) => {
    res.status(200).json({message: 'OK'})
})

app.use(express.static('public'))

app.use((req, res, next) => {
    const erro = new Error('Rota não encontrada');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.mensagem
        }
    })
});

module.exports = app;