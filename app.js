const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const { initializeApp, cert, } = require('firebase-admin/app');


require('dotenv').config();

const rotaUsuarios = require('./routes/usuarios')
const rotaStatus = require('./routes/status')
const rotaNivel = require('./routes/nivel')
const rotaPerfil = require('./routes/perfil')
const rotaSegmento = require('./routes/segmento')
const rotaPedido = require('./routes/pedido')
const rotaEntregador = require('./routes/entregador')
const rotaClientes = require('./routes/clientes')

const serviceAccount = require('./entreg10-1295b-firebase-adminsdk-ieb0u-0c2518860f.json');

initializeApp({
    credential: cert(serviceAccount),
  })

  
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


// This registration token comes from the client FCM SDKs.
/* 

const message = {
  data: {
    score: '850',
    time: '2:45'
  },
  topic: topic
};

// Send a message to the device corresponding to the provided
// registration token.
getMessaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  }); */



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

app.use('/usuarios', rotaUsuarios);
app.use('/perfil', rotaPerfil);
app.use('/status', rotaStatus);
app.use('/nivel', rotaNivel);
app.use('/segmento', rotaSegmento);
app.use('/pedido', rotaPedido);
app.use('/entregador', rotaEntregador);
app.use('/clientes', rotaClientes);

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