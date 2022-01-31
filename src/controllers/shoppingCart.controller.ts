import { Request, Response } from "express";

import HttpResponse from "@Shared/models/http.response";
import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";
import ShoppingCartRepository from "@Repositories/shoppingCart.repository";
import IShoppingCartDto from "@Shared/models/DTOs/requests/shoppingCart.dto";

export default class ShoppingCartController {
    private readonly shoppingCartRepository: ShoppingCartRepository;

    constructor(){
        this.shoppingCartRepository = new ShoppingCartRepository();
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.getCart = this.getCart.bind(this);
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as IShoppingCartDto;
            const userId = (req as any).user.id;
            const result = await this.shoppingCartRepository.create(data, userId);
            if(!result.success) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: result.message as string }));

            return res.status(StatusCode.Created)
                        .json(new HttpResponse({ 
                            message: result.message as string, 
                            success: true, 
                            statusCode: StatusCode.Created 
                        }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as IShoppingCartDto;
            const userId = (req as any).user.id;
            const result = await this.shoppingCartRepository.update(data, userId);
            if(!result.success) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: result.message as string }));

            return res.status(StatusCode.Ok)
                        .json(new HttpResponse({ 
                            message: result.message as string, 
                            success: true, 
                            statusCode: StatusCode.Ok
                        }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }

    async getCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id;
            const cart = await this.shoppingCartRepository.list(userId);
            return res.status(StatusCode.Ok)
                        .json(cart);
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }
}