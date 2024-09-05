export class CreateUserDto {
    
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    birthDate: Date
    profilePhotoUrl?: string
    role: string
    position: string
    phoneNumber: string
}
