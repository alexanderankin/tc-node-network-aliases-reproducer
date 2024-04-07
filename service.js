import express from 'express'
import pg from 'pg'

const app = express()
const port = 3000

console.log("starting service")

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const { Client } = pg

const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

console.log("connecting")
await client.connect();
console.log("connected")

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
