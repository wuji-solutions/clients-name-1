export type SSEHandler = (data: any, rawEvent?: MessageEvent) => void;

export class SSEDelegate {
    private handlers = new Map<string, Set<SSEHandler>>();

    on(eventName: string, handler: SSEHandler): () => void {
        let set = this.handlers.get(eventName);
        if (!set) {
            set = new Set();
            this.handlers.set(eventName, set);
        }
        set.add(handler);
        return () => this.off(eventName, handler);
    }

    off(eventName: string, handler: SSEHandler) {
        const set = this.handlers.get(eventName);
        if (!set) return;
        set.delete(handler);
        if (set.size === 0) this.handlers.delete(eventName);
    }

    delegate(eventName: string, data: any, rawEvent?: MessageEvent) {
        const set = this.handlers.get(eventName);
        if (!set) return;
        for (const h of Array.from(set)) {
            try {
                h(data, rawEvent);
            } catch (err) {
                console.error('SSE handler threw', err);
            }
        }
    }

    clearAll() {
        this.handlers.clear();
    }
}
