import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.status(200).send(`Hello from ${process.env.APP_NAME} api`);
})

export default app