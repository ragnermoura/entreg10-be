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
    conn.query("SELECT * FROM tb001_user", (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
});

router.get("/entregadores", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM tb001_user WHERE id_nivel = 3", (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
});

router.get("/:id_users", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb001_user WHERE id_users = ?",
      [req.params.id_users],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.patch("/edit_status_empresa", (req, res, next) => { 
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE tb001_user 
            SET id_status = ?
            WHERE id_users = ?`,
      [
        req.body.status,
        req.body.id_users,
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

router.delete("/delete", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      "DELETE FROM tb001_user WHERE id_users = ?",
      [req.body.id_users],
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

router.post("/cadastro", (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb001_user WHERE email = ?",
      [req.body.email],
      (error, result) => {
        if (err) {
          return res.status(500).send({ error: error });
        }
        if (result.length > 0) {
          res.status(409).send({
            mensagem:
              "Email já cadastrado, por favor insira um email diferente!",
          });
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }
            conn.query(
              "INSERT INTO tb001_user (nome, sobrenome, email, senha, id_nivel, id_status) VALUES (?,?,?,?,?,?)",
              [
                req.body.nome,
                req.body.sobrenome,
                req.body.email,
                hash,
                req.body.nivel,
                req.body.status,
                
              ],

              (error, result) => {
                conn.release();
                if (error) {
                  return res.status(500).send({
                    error: error,
                  });
                }

  
                const response = {
                  mensagem: "Usuário cadastrado com sucesso",

                  usuarioCriado: {
                    id_users: result.insertId,
                    nome: req.body.nome,
                    email: req.body.email,
                    nivel: req.body.nivel,

                    request: {
                      tipo: "GET",
                      descricao: "Pesquisa um usuário",
                      url: "https://entreg10.com.br:21038/usuarios",
                    },
                  },
                };

                return res.status(202).send(response);
              }
            );
          });
        }
      }
    );
  });
}),

  router.post("/login", (req, res, next) => {
    mysql.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send({ error: error });
      }
      const query = `SELECT * FROM tb001_user WHERE email = ?`;
      conn.query(query, [req.body.email], (error, results, field) => {
        conn.release();

        if (err) {
          return res.status(500).send({ error: error });
        }
        if (results.length < 1) {
          return res.status(401).send({
            mensagem: "Falha na autenticação.",
          });
        }
        bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
          if (err) {
            return res.status(401).send({ mensagem: "Falha na autenticação." });
          }
          if (result) {
            const token = jwt.sign(
              {
                id_users: results[0].id_users,
                nome: results[0].nome,
                sobrenome: results[0].sobrenome,
                email: results[0].email,
                senha: results[0].senha,
                id_nivel: results[0].id_nivel,
                id_status: results[0].id_status,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "6h",
              }
            );

            return res.status(200).send({
              mensagem: "Autenticado com sucesso!",
              token: token,
            });
          }
          return res.status(401).send({ mensagem: "Falha na autenticação." });
        });
      });
    });
  }),

  
  (module.exports = router);
