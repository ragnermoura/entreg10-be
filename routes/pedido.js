require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM tb007_pedido", (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
});

router.get("/abertos", (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query("SELECT tb007_pedido.*, tb001_user.nome FROM tb007_pedido JOIN tb001_user ON tb007_pedido.id_solicitante = tb001_user.id_users WHERE tb007_pedido.id_status = 3 LIMIT 1", (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      });
    });
  });

  router.get("/fila", (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query("SELECT * FROM tb007_pedido WHERE id_status = 3", (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      });
    });
  });

  router.get("/em-andamento", (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query("SELECT * FROM tb007_pedido WHERE id_status = 4", (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      });
    });
  });

  router.get("/entregue", (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query("SELECT * FROM tb007_pedido WHERE id_status = 5", (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      });
    });
  });

  router.patch("/edit", (req, res, next) => { 
    mysql.getConnection((error, conn) => {
      conn.query(
        `UPDATE tb007_pedido SET id_status = ?, id_entregador = ? WHERE idpedidos = ?`,
        [
          req.body.id_status,
          req.body.id_entregador,
          req.body.id_pedidos,
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
            mensagem: "Dados de usuário alterados com sucesso!",
          });
        }
      );
    })
  });

//Rotas de Soma

router.get("/hoje/:id_user", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM tb007_pedido WHERE id_status = 5 AND id_entregador = ? AND data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)", 
    [req.params.id_user],
    (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
});




//Rotas de mudança de estatus

  router.patch("/aceito", (req, res, next) => { 
    mysql.getConnection((error, conn) => {
      conn.query(
        `UPDATE tb007_pedido SET aceito = ?, id_status = 9 WHERE idpedidos = ?`,
        [

          req.body.aceito,
          req.body.id_pedidos,
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
            mensagem: "Dados de usuário alterados com sucesso!",
          });
        }
      );
    })
  });


  router.patch("/status-em-coleta", (req, res, next) => { 
    mysql.getConnection((error, conn) => {
      conn.query(
        `UPDATE tb007_pedido SET id_status = ? WHERE idpedidos = ?`,
        [
          req.body.id_status,
          req.body.id_pedidos,
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
            mensagem: "Dados de usuário alterados com sucesso!",
          });
        }
      );
    })
  });

  router.patch("/status-em-entrega", (req, res, next) => { 
    mysql.getConnection((error, conn) => {
      conn.query(
        `UPDATE tb007_pedido SET id_status = ? WHERE idpedidos = ?`,
        [
          req.body.id_status,
          req.body.id_pedidos,
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
            mensagem: "Dados de usuário alterados com sucesso!",
          });
        }
      );
    })
  });

  router.patch("/status-entregue", (req, res, next) => { 
    mysql.getConnection((error, conn) => {
      conn.query(
        `UPDATE tb007_pedido SET id_status = ? WHERE idpedidos = ?`,
        [
          req.body.id_status,
          req.body.id_pedidos,
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
            mensagem: "Dados de usuário alterados com sucesso!",
          });
        }
      );
    })
  });


//Rotas de exibição

  router.get("/suas-entregas/:id_user", (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query(
        "SELECT p.*, d.* FROM tb007_pedido p JOIN tb001_user u ON p.id_solicitante = u.id_users JOIN tb004_dados_empresa d ON d.id_user = u.id_users WHERE p.id_entregador = ? AND p.id_status = 4 AND p.data_pedido >= DATE_SUB(NOW(), INTERVAL 24 HOUR)",
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
      "SELECT * FROM tb007_pedido WHERE id_solicitante = ?",
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
      "INSERT INTO tb007_pedido (nome_cliente, endereco_entrega, cep, telefone1, valor_pedido, metodo_pagamento, id_solicitante, id_status) VALUES (?,?,?,?,?,?,?,?)",
      [
        req.body.nome,
        req.body.endereco,
        req.body.cep,
        req.body.telefone,
        req.body.valor,
        req.body.metodo,
        req.body.id_user,
        req.body.status,
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
