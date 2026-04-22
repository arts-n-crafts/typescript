import type { AppendsDomainEvents } from "@adapters/outbound/capabilities/AppendsDomainEvents.ts";
import type { LoadsDomainEvents } from "@adapters/outbound/capabilities/LoadsDomainEvents.ts";
import type { StoredEvent } from "@adapters/outbound/shapes/StoredEvent.ts";
import type { StreamKey } from "@adapters/outbound/shapes/StreamKey.ts";
import type { DomainEvent } from "@core/shapes/DomainEvent.ts";

export class InMemoryEventStore<TEvent extends DomainEvent>
  implements LoadsDomainEvents<Promise<TEvent[]>>, AppendsDomainEvents<TEvent>
{
  private readonly tableName: string = "event_store";
  private readonly datasource = new Map<string, StoredEvent<TEvent>[]>();

  async load(streamName: string, aggregateId: string): Promise<TEvent[]> {
    const streamKey: StreamKey = `${streamName}#${aggregateId}`;
    if (!this.datasource.has(this.tableName)) this.datasource.set(this.tableName, []);
    const rows = this.datasource.get(this.tableName);
    return rows!.filter((row) => row.streamKey === streamKey).map((row) => row.event);
  }

  async append(domainEvents: TEvent[]): Promise<void> {
    if (!this.datasource.has(this.tableName)) this.datasource.set(this.tableName, []);
    const rows = this.datasource.get(this.tableName);

    domainEvents.forEach((event) => {
      const streamKey: StreamKey = `${event.aggregateType}#${event.aggregateId}`;
      const version = rows?.length ? rows.length + 1 : 1;
      const storedEvent: StoredEvent<TEvent> = {
        id: event.id,
        timestamp: new Date().getTime(),
        streamKey,
        version,
        event,
      };
      rows?.push(storedEvent);
    });
    return;
  }
}
