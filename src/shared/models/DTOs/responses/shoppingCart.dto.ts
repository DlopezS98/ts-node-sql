export default interface IShoppingCartDto {
    cart_id: number;
    user_id: number;
    username: string;
    product_detail_id: number;
    name: string;
    description: string;
    attributes: Record<string, any>;
    price: number;
    quantity: 3;
    sub_total: number;
    regular_price: number;
    tax_rate?: number;
    total_tax_rate?: number;
    total: number;
    created_at: Date;
    updated_at: Date;
}