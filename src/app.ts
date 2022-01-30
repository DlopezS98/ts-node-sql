import express, { Express, urlencoded, json, Request, Response } from "express";
import cors from "cors";

import Environment from "./config/environment";
import Products from "./database/models/products.model";

const environment = new Environment();

const app: Express = express();
// settings
app.set('port', environment.PORT);

// middlewares
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get('/', async (req: Request, res: Response) => {
    const products = await Products.query().select('*').where('deleted', '=', 'false');
    res.status(200).json(products);
});

export default app;