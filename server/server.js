const express = require("express");
const cors = require("cors");

const keys = require("./keys");

const app = express();

app.use(express.json());
app.use(cors());

const { Pool } = require("pg");

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.connect(async (err) => {
  if (err) return console.log("something went wrong!");
  const client = await pgClient.connect();
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "values" (
        id SERIAL PRIMARY KEY,
        number INTEGER
      );
    `;

    // Execute the CREATE TABLE query
    await client.query(createTableQuery);
    console.log("Table created successfully");
  } catch (err) {
    console.log(err);
  }
});

// pgClient.on("connect", () => {
//   console.log("connection successfull");
//   pgClient
//     .query('CREATE TABLE IF NOT EXISTS "values" (number INT)')
//     .catch((err) => console.log("GOT ERROR", err));
// });

const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

app.get("/", (req, res) => {
  res.send("Hii there!");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query('SELECT * from "values"');
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high!");
  }
  redisClient.hset("values", index, "Nothing yet!");
  redisClient.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
