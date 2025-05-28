
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  data: any;
  metadata: {
    timestamp: Date;
    userId?: string;
    correlationId?: string;
    causationId?: string;
  };
  version: number;
}

export interface EventHandler<T = any> {
  handle(event: DomainEvent<T>): Promise<void>;
}

export interface EventStore {
  append(streamId: string, events: DomainEvent[]): Promise<void>;
  getEvents(streamId: string, fromVersion?: number): Promise<DomainEvent[]>;
  getAllEvents(fromTimestamp?: Date): Promise<DomainEvent[]>;
}

export class InMemoryEventStore implements EventStore {
  private events: Map<string, DomainEvent[]> = new Map();
  private globalEvents: DomainEvent[] = [];

  async append(streamId: string, events: DomainEvent[]): Promise<void> {
    const existingEvents = this.events.get(streamId) || [];
    this.events.set(streamId, [...existingEvents, ...events]);
    this.globalEvents.push(...events);
    console.log(`Appended ${events.length} events to stream ${streamId}`);
  }

  async getEvents(streamId: string, fromVersion?: number): Promise<DomainEvent[]> {
    const events = this.events.get(streamId) || [];
    return fromVersion ? events.filter(e => e.version >= fromVersion) : events;
  }

  async getAllEvents(fromTimestamp?: Date): Promise<DomainEvent[]> {
    return fromTimestamp 
      ? this.globalEvents.filter(e => e.metadata.timestamp >= fromTimestamp)
      : this.globalEvents;
  }
}

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private eventStore: EventStore;

  constructor(eventStore: EventStore) {
    this.eventStore = eventStore;
  }

  subscribe<T>(eventType: string, handler: EventHandler<T>): void {
    const existingHandlers = this.handlers.get(eventType) || [];
    existingHandlers.push(handler);
    this.handlers.set(eventType, existingHandlers);
    console.log(`Subscribed handler for event type: ${eventType}`);
  }

  async publish(events: DomainEvent | DomainEvent[]): Promise<void> {
    const eventList = Array.isArray(events) ? events : [events];
    
    // Store events
    for (const event of eventList) {
      const streamId = `${event.aggregateType}-${event.aggregateId}`;
      await this.eventStore.append(streamId, [event]);
    }

    // Notify handlers
    for (const event of eventList) {
      const handlers = this.handlers.get(event.type) || [];
      await Promise.all(
        handlers.map(handler => 
          handler.handle(event).catch(error => 
            console.error(`Error in event handler for ${event.type}:`, error)
          )
        )
      );
    }
  }

  async replay(fromTimestamp?: Date): Promise<void> {
    const events = await this.eventStore.getAllEvents(fromTimestamp);
    console.log(`Replaying ${events.length} events from ${fromTimestamp || 'beginning'}`);
    
    for (const event of events) {
      const handlers = this.handlers.get(event.type) || [];
      await Promise.all(
        handlers.map(handler => handler.handle(event))
      );
    }
  }
}

// Event factory
export class EventFactory {
  static createEvent<T>(
    type: string,
    aggregateId: string,
    aggregateType: string,
    data: T,
    metadata: Partial<DomainEvent['metadata']> = {}
  ): DomainEvent<T> {
    return {
      id: crypto.randomUUID(),
      type,
      aggregateId,
      aggregateType,
      data,
      metadata: {
        timestamp: new Date(),
        correlationId: crypto.randomUUID(),
        ...metadata,
      },
      version: 1,
    };
  }
}

// Domain event types
export const EventTypes = {
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  INVENTORY_UPDATED: 'inventory.updated',
  STOCK_OUT_DETECTED: 'stock-out.detected',
  WASTAGE_RECORDED: 'wastage.recorded',
  CONSUMPTION_UPDATED: 'consumption.updated',
  USER_ACTION_LOGGED: 'user-action.logged',
} as const;

// Example event handlers
export class ProductEventHandler implements EventHandler {
  async handle(event: DomainEvent): Promise<void> {
    switch (event.type) {
      case EventTypes.PRODUCT_CREATED:
        console.log('Product created:', event.data);
        break;
      case EventTypes.PRODUCT_UPDATED:
        console.log('Product updated:', event.data);
        break;
      case EventTypes.PRODUCT_DELETED:
        console.log('Product deleted:', event.aggregateId);
        break;
    }
  }
}

export class AnalyticsEventHandler implements EventHandler {
  async handle(event: DomainEvent): Promise<void> {
    // Update analytics aggregations
    console.log('Updating analytics for event:', event.type);
  }
}

// Global event system instance
export const eventStore = new InMemoryEventStore();
export const eventBus = new EventBus(eventStore);

// Register default handlers
eventBus.subscribe(EventTypes.PRODUCT_CREATED, new ProductEventHandler());
eventBus.subscribe(EventTypes.PRODUCT_UPDATED, new ProductEventHandler());
eventBus.subscribe(EventTypes.PRODUCT_DELETED, new ProductEventHandler());
eventBus.subscribe(EventTypes.INVENTORY_UPDATED, new AnalyticsEventHandler());
eventBus.subscribe(EventTypes.CONSUMPTION_UPDATED, new AnalyticsEventHandler());
