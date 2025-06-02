import { InMemoryUserRepository } from "./repositories/InMemoryUserRepository";
import { GetAllUsers } from "../use-cases/user/getAllUsers";

class DIContainer {
    private static _userRepository = new InMemoryUserRepository();

    static getUserRepository() {
        return this._userRepository;
    }

    static getGetAllUsersUseCase() {
        return new GetAllUsers(this.getUserRepository());
    }
}

export { DIContainer }