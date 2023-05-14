import { db } from "../database/db.js";

export async function findAllGames(req, res) {
  try {
    const products = await db.query("SELECT * FROM games");
    res.send(products.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

export async function findGamesById(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.sendStatus(400);

  try {
    // Implemente essa função

    const product = await db.query(`SELECT * FROM produtos WHERE id=$1`, [id])
    res.status(201).send(product.rows[0]);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

export async function createGame(req, res) {
  const { nome, preco, condicao } = req.body;

  try {
    // Implemente essa função também

    await db.query(`INSERT INTO produtos (nome, preco, condicao) VALUES ($1, $2, $3)`, [nome, preco, condicao]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
