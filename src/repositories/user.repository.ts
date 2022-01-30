import Users, { IUser } from "@Models/Users.model";
import { knexQuery } from "@Database/connection";

export default class UserRepository {

    public async create(email: string, username: string, password: string) {

        const response = await this.verifyIfUserExists(email, username);
        if(response.error) return { error: response.error, message: response.message, data: null };

        const user = await Users.query().insert({
            email,
            username,
            password
        });
        
        return { error: false, message: "user created successfully!" };
    }

    public async verifyIfUserExists(email: string, username: string): Promise<{ error: boolean, message: string }> {
        const _email = await knexQuery<IUser>("users").select("id").where("email", "=", email).first();
        if(_email) return { error: true, message: "email already exists" };

        const _username = await knexQuery<IUser>("users").select("id").where("username", "=", username).first();
        if(_username) return { error: true, message: "username already exists" };

        return { error: false, message: "" };
    }

    public async list(): Promise<IUser[]> {
        const users = await knexQuery<IUser>("users").select("*").where("deleted", "<>", true);
        return users;
    }
}