import express from "express";
import logger from "#config/logger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message) } }));

app.get('/', (req, res) => {
    logger.info('Hello from this POC backend')
    res.status(200).send(`Hello from ${process.env.APP_NAME} api`);
})

export default app