require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("../app");
const { Op, Sequelize } = require('sequelize')
const { getMessaging } = require('firebase-admin/messaging');
const Tb007_pedido = require("../models/Pedido");
const Tb001_user = require("../models/User");

router.get("/", async (req, res, next) => {
 /*  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(conn, error)
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM tb007_pedido", (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
 */
  const data = await Tb007_pedido.findAll()
  res.status(200).json({response: data})

});

router.get("/abertos", async (req, res, next) => {
   
  // mysql.getConnection((error, conn) => {
  //   if (error) {
  //     return res.status(500).send({ error: error });
  //   }
  //   conn.query(
  //     "SELECT tb007_pedido.*, tb001_user.nome FROM tb007_pedido JOIN tb001_user ON tb007_pedido.id_solicitante = tb001_user.id_users WHERE tb007_pedido.id_status = 4 OR tb007_pedido.id_status = 10 LIMIT 1",
  //     (error, resultado, fields) => {
  //       if (error) {
  //         return res.status(500).send({ error: error });
  //       }
  //       return res.status(200).send({ response: resultado });
  //     }
  //   );
  // }); 

  const data = await Tb007_pedido.findAll({
    where: {
      id_status: {
        [Op.or]: [4, null]
      }
    },
    include: [
      {
        model: Tb001_user,
        attributes: ['nome'],
        required: true,
        on: {
          id_users: Sequelize.col('tb007_pedido.id_solicitante')
        }
      }
    ],
    limit: 1
  });
  
  res.status(200).json({response: data})

});

router.get("/fila",async (req, res, next) => {
/*   mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb007_pedido WHERE id_status = 4",
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ ßresponse: resultado });
      }
    );
  });
 */
  const data = await Tb007_pedido.findAll({
    where: {
    
      [Op.or]: [{id_status: 4}, {id_status: 10}]
  
   },
   })
   res.status(200).json({response: data})
 
});

router.get("/em-andamento", async (req, res, next) => {
  /* mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb007_pedido JOIN tb001_user ON tb007_pedido.id_entregador = tb001_user.id_users WHERE tb007_pedido.id_status != 5 AND tb007_pedido.id_status != 7;",
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  }); */

  const data = await Tb007_pedido.findAll({
    where: {
     
       [Op.and]: [

        {id_status: {
          [Op.ne]:5
        }}, 
        {id_status: {
          [Op.ne]:7
        }}, 

      ]
   
    },
    include:
    {
      model: Tb001_user,
      attributes: ['id_users'],
      attributes: ['nome'],
      required: true,

    }
  })
    
   res.status(200).json({response: data})
 

});

router.get("/entregue", async (req, res, next) => {
  /* mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb007_pedido JOIN tb001_user ON tb007_pedido.id_entregador = tb001_user.id_users WHERE tb007_pedido.id_status = 5;",
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  }); */

  const data = await Tb007_pedido.findAll({
    where: {
        id_status:5
    },
    include:
    {
      model: Tb001_user,
      attributes: ['id_users'],
      attributes: ['nome'],
      required: true,
      
    }
  })
    
   res.status(200).json({response: data})
 
});

router.patch("/edit", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE tb007_pedido SET id_status = ?, id_entregador = ? WHERE idpedidos = ?`,
      [req.body.id_status, req.body.id_entregador, req.body.id_pedidos],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
      

        res.status(201).send({
          mensagem: "Dados de usuário alterados com sucesso!",
        });

        const message = {
          notification: {
            title: 'Nova Entrega',
            body: 'Um novo pedido foi encaminhado a você'
        },
        
        topic: `${req.body.id_entregador}`
        };
        
        // Send a message to devices subscribed to the provided topic.
        getMessaging().send(message)
          .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
      }
    );
  });


});

//Rotas de Soma Entregador

router.get("/hoje/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/semana/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/mes/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND MONTH(p.data_pedido) = MONTH(NOW())",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

//Rotas de Soma Cliente

router.get("/hoje/cliente/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_solicitante = ? AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        let count = 0

        resultado.map(item => count = count + 1)

        console.log(count)

        return res.status(200).send({ response: count });
      }
    );
  });
});

router.get("/semana/cliente/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_solicitante = ? AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }let count = 0

        resultado.map(item => count = count + 1)

        console.log(count)

        return res.status(200).send({ response: count });
      
      }
    );
  });
});

router.get("/mes/cliente/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_solicitante = ? AND MONTH(p.data_pedido) = MONTH(NOW())",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        let count = 0

        resultado.map(item => count = count + 1)

        console.log(count)

        return res.status(200).send({ response: count });
      }
    );
  });
});


//Rotas de Soma Cliente

router.get("/hoje/admin/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb007_pedido WHERE data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        let count = 0

        resultado.map(item => count = count + 1)

        console.log(count)

        return res.status(200).send({ response: count });
      }
    );
  });
});

router.get("/semana/admin/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb007_pedido WHERE data_pedido >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }let count = 0

        resultado.map(item => count = count + 1)

        console.log(count)

        return res.status(200).send({ response: count });
      
      }
    );
  });
});

router.get("/mes/admin/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb007_pedido WHERE MONTH(data_pedido) = MONTH(NOW())",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        let count = 0

        resultado.map(item => count = count + 1)

        console.log(count)

        return res.status(200).send({ response: count });
      }
    );
  });
});

//Rotas de mudança de estatus

router.patch("/aceito", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE tb007_pedido SET aceito = ?, id_status = 9 WHERE idpedidos = ?`,
      [req.body.aceito, req.body.id_pedidos],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Dados de usuário alterados com sucesso!",
        });
      }
    );
  });
});

router.patch("/status-em-coleta", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE tb007_pedido SET id_status = ? WHERE idpedidos = ?`,
      [req.body.id_status, req.body.id_pedidos],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Dados de usuário alterados com sucesso!",
        });
      }
    );
  });
});

router.patch("/status-em-entrega", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE tb007_pedido SET id_status = ? WHERE idpedidos = ?`,
      [req.body.id_status, req.body.id_pedidos],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Dados de usuário alterados com sucesso!",
        });
      }
    );
  });
});

router.patch("/status-entregue", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE tb007_pedido SET id_status = ? WHERE idpedidos = ?`,
      [req.body.id_status, req.body.id_pedidos],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Dados de usuário alterados com sucesso!",
        });
      }
    );
  });
});

//Rotas de exibição

router.get("/suas-entregas/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.id_status = 4 OR p.id_status = 10 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/historic/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ?",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/suas-entregas-entregue/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.id_status = 5 AND p.aceito = 1 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/suas-entregas-entrega/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.id_status = 3 AND p.aceito = 1 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/suas-entregas-coleta/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.id_status = 8 AND p.aceito = 1 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/suas-entregas-fila/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.id_status = 9 AND p.aceito = 1 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/suas-entregas-detalhes/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ?  AND p.aceito = 1 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/suas-entregas-aceito/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.aceito = 1 AND p.id_status = 3 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/suas-entregas-rejeitado/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.aceito = 0 AND p.id_status = 7 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
      [req.params.id_user],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.get("/:id_solicitante", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb007_pedido JOIN tb001_user ON tb007_pedido.id_entregador = tb001_user.id_users WHERE tb007_pedido.id_solicitante = ?",
   
      //"SELECT tb007_pedido.*, tb001_user.* FROM tb007_pedido JOIN tb001_user ON tb007_pedido.id_solicitante = tb001_user.id_users  WHERE tb007_pedido.id_solicitante = ?",
     // "SELECT p.*, s.*, e.* FROM tb007_pedido p INNER JOIN tb001_user s ON p.id_solicitante = s.id_users INNER JOIN tb001_user e ON p.id_entregador = e.id_users WHERE p.id_solicitante = ?;",
      [req.params.id_solicitante],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.delete("/delete", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      "DELETE FROM tb007_pedido WHERE idpedido = ?",
      [req.body.idpedido],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }

        return res.status(202).send({
          mensagem: "Usuário excluido com sucesso!",
        });
      }
    );
  });
});

router.post("/novo", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO tb007_pedido (nome_cliente, endereco_entrega, cep, telefone1, valor_pedido, metodo_pagamento, id_solicitante, id_status, numero_entrega) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        req.body.nome,
        req.body.endereco,
        req.body.cep,
        req.body.telefone,
        req.body.valor,
        req.body.metodo,
        req.body.id_user,
        req.body.status,
        req.body.numero,
      ],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Pedido cadastrado com sucesso!",
          id_status: resultado.insertId,
        });
      }
    );
  });
});

router.post("/entregador", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO tb006_dados_entregador (endereco, cep, telefone1, telefone2, cnh, cpf, id_user, marca_moto, modelo_moto, ano_moto) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.endereco,
        req.body.cep,
        req.body.telefone1,
        req.body.telefone2,
        req.body.cnh,
        req.body.cpf,
        req.body.id_user,
        req.body.marca_moto,
        req.body.modelo_moto,
        req.body.ano_moto,
      ],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Perfil cadastrado com sucesso!",
          id_status: resultado.insertId,
        });
      }
    );
  });
});

module.exports = router;
