import { Request, Response } from "express";
import HttpResponse from "@CommonModels/http.response";
import { HttpStatusCodes as StatusCode } from "@CommonModels/status.codes";
import UserRepository from "@Repositories/user.repository";
import UserDTO from "@CommonModels/DTOs/user.dto";

export default class AuthController {
    private readonly userRepository: UserRepository;
    constructor(){
        this.userRepository = new UserRepository();
        this.SignUp = this.SignUp.bind(this);
    }

    public async SignUp(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.body as Pick<UserDTO, "email" | "username" | "password">
            const data = await this.userRepository.create(user.email, user.username, user.password);
            if(data.error) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: data.message }));

            return res.status(StatusCode.Created).json(new HttpResponse({ message: data.message, statusCode: StatusCode.Created }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }))
        }
    }
}