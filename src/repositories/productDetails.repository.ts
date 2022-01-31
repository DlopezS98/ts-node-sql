import ProductDetails from "@Database/models/ProductDetails.model";
import IProductDetailsRequestDto from "@Shared/models/DTOs/requests/productDetails.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class ProductDetailsRepository {
    async create(data: IProductDetailsRequestDto): Promise<TransactionResponse> {
        await ProductDetails.query().insert({
            product_id: data.productId,
            category_id: data.categoryId,
            description: data.description,
            price: data.price,
            stock: data.stock,
            regular_price: data.regularPrice,
            attributes: data.attributes,
            tax_rate: data.taxRate
        });

        return { success: true, message: "Product detail created successfully!" }
    }
}