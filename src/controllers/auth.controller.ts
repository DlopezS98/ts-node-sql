import { Request, Response } from "express";
import HttpResponse from "@Shared/models/http.response";
import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";
import UserRepository from "@Repositories/user.repository";
import UserDTO from "@Shared/models/DTOs/user.dto";

export default class AuthController {
    private readonly userRepository: UserRepository;
    constructor(){
        this.userRepository = new UserRepository();
        this.SignUp = this.SignUp.bind(this);
        this.SignIn = this.SignIn.bind(this);
    }

    public async SignUp(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.body as Pick<UserDTO, "email" | "username" | "password">;
            const data = await this.userRepository.create(user.email, user.username, user.password);
            if(data.error) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: data.message }));

            return res.status(StatusCode.Created).json(new HttpResponse({ message: data.message, statusCode: StatusCode.Created }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }

    public async SignIn(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.body as { user: string, password: string };
            const data = await this.userRepository.validateCredentials(user.user, user.password);
            if(data.error) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: data.message }));

            return res.status(StatusCode.Ok).json(new HttpResponse({ message: "You're logged in successfully!", statusCode: StatusCode.Ok, data: data.data }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }
}