import { Router } from "express";
import { verifyToken } from "@Middlewares/auth.jwt";
import ProductDetailsController from "@Controllers/productDetails.controller";

const prodDetailCtrl: ProductDetailsController = new ProductDetailsController();
const router: Router = Router();

router.post('/', verifyToken, prodDetailCtrl.create);
// router.patch('/', verifyToken, prodDetailCtrl.update);
// router.delete('/:id', verifyToken, prodDetailCtrl.deleteProduct);
// router.get('/', verifyToken, prodDetailCtrl.getCart);
// router.delete('/', verifyToken, prodDetailCtrl.delete);

export default router;