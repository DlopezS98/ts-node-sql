export interface IShoppingCartDto {
    cart_id: number;
    user_id: number;
    username: string;
    products: {
        product_detail_id: number;
        name: string;
        price: string;
        description: string;
        regular_price: string;
        tax_rate?: any;
        attributes: Record<string, any>;
        quantity: number;
        sub_total: string;
        total: string;
    }[],
    total_quantity: number;
    total_to_pay: string;
    created_at: Date;
    updated_at: Date;
}

export interface IRawShoppingCartDto {
    cart_id: number;
    user_id: number;
    username: string;
    product_detail_id: number;
    name: string;
    price: string;
    description: string;
    regular_price: string;
    tax_rate?: any;
    total_quantity: number;
    attributes: Record<string, any>;
    quantity: number;
    total_to_pay: string;
    sub_total: string;
    total: string;
    created_at: Date;
    updated_at: Date;
}