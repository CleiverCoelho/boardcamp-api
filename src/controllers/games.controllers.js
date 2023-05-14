import joi from "joi";
import { db } from "../database/db.js";

export async function findAllGames(req, res) {
  try {
    const products = await db.query("SELECT * FROM games");
    res.send(products.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
}


export async function createGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  const useSchemaCadastro = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().required(),
    pricePerDay: joi.number().required()
  })

  if(pricePerDay <= 0 || stockTotal <= 0) return res.status(400).send("stock total e price per day menores que zero")

  const validacao = useSchemaCadastro.validate(req.body, {abortEarly: false})
  if (validacao.error) {
      const errors = validacao.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }
  try {
    // Implemente essa função também

    await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`, 
      [name, image, stockTotal, pricePerDay]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
