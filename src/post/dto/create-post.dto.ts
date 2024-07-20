import { User } from "src/users/entities/user.entity"

export class CreatePostDto {
    
    title: string
    content: string
    type: 'text' | 'image' | 'video'
    author: User
}
