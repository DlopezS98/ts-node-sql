import express, { Express, urlencoded, json, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import Environment from "@Config/environment";
import pkg from "../package.json";
import authRoutes from "@Routes/auth.routes";
import cartRoutes from "@Routes/shoppingCart.routes";
import prodDetailRoutes from "@Routes/productDetails.routes";

const environment = new Environment();

const app: Express = express();
// settings
app.set("pkg", pkg);
app.set('port', environment.PORT);

// middlewares
app.use(morgan("dev"))
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to shopping cart API",
        name: app.get("pkg").name,
        version: app.get("pkg").version,
        description: app.get("pkg").description,
        author: app.get("pkg").author
    })
});

app.use("/api/auth", authRoutes);
app.use("/api/shopping_cart", cartRoutes);
app.use("/api/product_details", prodDetailRoutes);

export default app;