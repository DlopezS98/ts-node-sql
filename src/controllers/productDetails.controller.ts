import { Request, Response } from "express";

import ProductDetailsRepository from "@Repositories/productDetails.repository";
import IProductDetailsRequestDto from "@Shared/models/DTOs/requests/productDetails.dto";
import HttpResponse from "@Shared/models/http.response";
import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";

export default class ProductDetailsController {
    private readonly productDetailRepository: ProductDetailsRepository;
    constructor() {
        this.productDetailRepository = new ProductDetailsRepository();
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as IProductDetailsRequestDto;
            const result = await this.productDetailRepository.create(data);
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
}