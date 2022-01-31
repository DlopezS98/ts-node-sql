import { Router } from "express";
import ShoppingCartController from "@Controllers/shoppingCart.controller";
import { verifyToken } from "@Middlewares/auth.jwt";

const cartCtrl: ShoppingCartController = new ShoppingCartController();
const router: Router = Router();

router.post('/', verifyToken, cartCtrl.create);
router.patch('/', verifyToken, cartCtrl.update);
router.get('/', verifyToken, cartCtrl.getCart);

export default router;