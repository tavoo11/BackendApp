// create-notification.dto.ts
export class CreateNotificationDto {
  message: string;
  userId: number;  // El trabajador que recibirá la notificación
}
