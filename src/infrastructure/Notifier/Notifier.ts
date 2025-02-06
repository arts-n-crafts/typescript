import { type IDomainEvent } from "../../domain/DomainEvent/DomainEvent";

type NotificationChannel = "websocket" | "email" | "sms" | "push";

export interface Notifier {
  notify(event: IDomainEvent, channels: NotificationChannel[]): void;
}
