import express, { Express, urlencoded, json, Request, Response } from "express";
import cors from "cors";

import Environment from "./config/environment";
import { knexQuery } from "./database/connection";
import { IProductDetail } from "database/models/ProductDetails.model";

const environment = new Environment();

const app: Express = express();
// settings
app.set('port', environment.PORT);

// middlewares
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get('/', async (req: Request, res: Response) => {
    const products = await knexQuery<IProductDetail>("product_details").select("id", "product_id", "category_id", "description", "attributes").where("deleted", "<>", true);
    res.status(200).json(products);
});

export default app;