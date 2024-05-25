import { User } from "src/users/entities/user.entity"

export class CreateAuthDto {
    accesstoken: string
    user: User
}
