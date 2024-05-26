export class CreatePostDto {
    
    title: string
    content: string
    type: 'text' | 'image' | 'video'
}
