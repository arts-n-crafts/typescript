import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";

type NotificationChannel = "websocket" | "email" | "sms" | "push";

export interface Notifier {
  notify(event: DomainEvent<unknown>, channels: NotificationChannel[]): void;
}
