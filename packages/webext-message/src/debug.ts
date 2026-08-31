/**
 * Debug utilities for webext-message
 * Use in development only, remove from production
 */

/** One recorded debug event. */
interface DebugEvent {
	timestamp: number;
	type: "send" | "receive" | "port-connect" | "port-disconnect" | "error";
	name: string;
	data?: any;
	error?: string;
	tabId?: number;
}

/**
 * Ring-buffer logger for message/port activity. Disabled by default
 * (all `log*` calls are no-ops) so it's safe to import unconditionally;
 * call `enable()` in development to start recording.
 */
export class MessageDebugger {
	private events: DebugEvent[] = [];
	private maxEvents = 500;
	private enabled = false;

	/** Turn on event recording. */
	enable() {
		this.enabled = true;
		console.log("[webext-message] Debug enabled");
	}

	/** Turn off event recording. Existing events are kept. */
	disable() {
		this.enabled = false;
		console.log("[webext-message] Debug disabled");
	}

	/** Record an outgoing message. No-op unless {@link enable} was called. */
	logSend(name: string, body: any, tabId?: number) {
		this.record("send", { name, data: body, tabId });
	}

	/** Record an incoming message. No-op unless {@link enable} was called. */
	logReceive(name: string, body: any, tabId?: number) {
		this.record("receive", { name, data: body, tabId });
	}

	/** Record a port connecting. No-op unless {@link enable} was called. */
	logPortConnect(name: string) {
		this.record("port-connect", { name });
	}

	/** Record a port disconnecting. No-op unless {@link enable} was called. */
	logPortDisconnect(name: string) {
		this.record("port-disconnect", { name });
	}

	/** Record a handler error. No-op unless {@link enable} was called. */
	logError(name: string, error: Error) {
		this.record("error", { name, error: error.message });
	}

	/**
	 * Shared implementation behind all `log*` methods: bails out when
	 * disabled, otherwise builds the event and appends it.
	 */
	private record(
		type: DebugEvent["type"],
		fields: Omit<DebugEvent, "timestamp" | "type">,
	) {
		if (!this.enabled) return;

		this.addEvent({
			timestamp: Date.now(),
			type,
			...fields,
		});
	}

	/** Append an event to the buffer, trimming to `maxEvents`. */
	private addEvent(event: DebugEvent) {
		this.events.push(event);

		if (this.events.length > this.maxEvents) {
			this.events = this.events.slice(-this.maxEvents);
		}

		console.debug("[webext-message]", event);
	}

	/** All recorded events, oldest first. */
	getEvents(): DebugEvent[] {
		return this.events;
	}

	/** Aggregate counts of recorded events, by type and by message/port name. */
	getStats() {
		const stats: Record<string, any> = {
			total: this.events.length,
			byType: {},
			byName: {},
		};

		for (const event of this.events) {
			// By type
			if (!stats.byType[event.type]) {
				stats.byType[event.type] = 0;
			}
			stats.byType[event.type]++;

			// By name
			if (!stats.byName[event.name]) {
				stats.byName[event.name] = { send: 0, receive: 0, errors: 0 };
			}
			if (event.type === "send") stats.byName[event.name].send++;
			if (event.type === "receive") stats.byName[event.name].receive++;
			if (event.type === "error") stats.byName[event.name].errors++;
		}

		return stats;
	}

	/** Clear all recorded events. */
	clear() {
		this.events = [];
		console.log("[webext-message] Debug events cleared");
	}

	/** Print {@link getStats} as a table. */
	printStats() {
		console.table(this.getStats());
	}

	/** Print all recorded events as a table. */
	printEvents() {
		console.table(this.getEvents());
	}
}

let debuggerInstance: MessageDebugger | undefined;

/**
 * Lazily creates and returns the singleton {@link MessageDebugger}.
 * Same instance-caching pattern as `getPortMap`/`getHubMap` elsewhere
 * in this library — module-scoped variable, no `declare global`.
 */
export function getDebugger(): MessageDebugger {
	if (!debuggerInstance) {
		debuggerInstance = new MessageDebugger();
	}
	return debuggerInstance;
}

// Enable on window for console access
if (typeof window !== "undefined") {
	(window as any).__extMessagingDebugger = getDebugger();
}
