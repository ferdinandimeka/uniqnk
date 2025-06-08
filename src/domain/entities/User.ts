export class User {
    constructor(
        public readonly id: string,
        public fullName: string,
        public username: string,
        public email: string,
        public phone: string,
        public password: string,
    ) {}
}