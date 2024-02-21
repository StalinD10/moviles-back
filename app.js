import express from 'express';
import morgan from 'morgan';
import backRoutes from './src/routes/back.routes.js'
import cors from "cors"

const app = express();


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api', backRoutes)


export default app;