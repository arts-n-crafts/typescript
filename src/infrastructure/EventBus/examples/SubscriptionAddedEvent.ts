import { Event } from '../Event'

export interface SubscriptionAddedEventProps {
  userId: string
  subscriptionId: string
}

export class SubscriptionAddedEvent extends Event<SubscriptionAddedEventProps> { }
