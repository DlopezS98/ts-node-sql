import { ICategory } from "./models/Categories.model";
import { IProduct } from "./models/Products.model";
import { IProductDetail } from "./models/ProductDetails.model";
import { IUser } from "./models/Users.model";
import { IShoppingCart } from "./models/ShoppingCart.model";

export interface ITables {
    products: IProduct;
    categories: ICategory;
    users: IUser;
    product_details: IProductDetail;
    shopping_cart: IShoppingCart;
}