import { db } from "../database/db.js";
import joi from "joi";

export async function findAllRentals(req, res) {

    try {
        const customers = await db.query(`
            SELECT customers.name AS customer, customers.id AS "customerId", 
                games.name AS game, games.id AS "gameId", rentals.* 
                FROM rentals
                JOIN games 
                    ON games.id=rentals."gameId"
                JOIN customers 
                    ON customers.id=rentals."customerId";`);
            
        const responsePattern = customers.rows.map(customer => {
            return ({
                id: customer.id,
                rentDate: new Date(customer.rentDate).toISOString().split('T')[0],
                daysRented: customer.daysRented,
                returnDate: customer.returnDate,
                originalPrice: customer.originalPrice,
                delayFee: customer.delayFee,
                customer: {id: customer.customerId, name: customer.customer},
                game: {id: customer.gameId, name: customer.game} 
            })
        })
        
        res.send(responsePattern);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

export async function findCustomersById(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.sendStatus(400);

  try {
    // Implemente essa função

    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id])
    // trata a data de aniversario para o jeito esperado pela requisicao "yyyy/mm/dd"
    customer.rows[0].birthday = new Date(customer.rows[0].birthday).toISOString().split('T')[0];
    res.status(201).send(customer.rows[0]);
  } catch (err) {
    res.status(404).send(err.message);
  }
}

  
