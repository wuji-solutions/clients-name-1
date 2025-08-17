import { SSEDelegate } from './SSEDelegate';

type Channel = {
  url: string;
  es: EventSource;
  delegate: SSEDelegate;
  boundTypes: Set<string>;
};

export class SSEManager {
  private channels = new Map<string, Channel>();

  getDelegate(url: string, opts?: EventSourceInit): SSEDelegate {
    let ch = this.channels.get(url);
    if (ch) return ch.delegate;

    const es = new EventSource(url, opts);
    const delegate = new SSEDelegate();
    const boundTypes = new Set<string>();

    es.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data);
        const name = parsed.name ?? 'message';
        const data = parsed.data ?? parsed;
        delegate.delegate(name, data, ev);
      } catch {
        delegate.delegate('message', ev.data, ev);
      }
    };

    const originalOn = delegate.on.bind(delegate);
    delegate.on = (eventName, handler) => {
      if (!boundTypes.has(eventName) && eventName !== 'message') {
        es.addEventListener(eventName, (ev: MessageEvent) => {
          try {
            const parsed = JSON.parse(ev.data);
            delegate.delegate(eventName, parsed, ev);
          } catch {
            delegate.delegate(eventName, ev.data, ev);
          }
        });
        boundTypes.add(eventName);
      }
      return originalOn(eventName, handler);
    };

    ch = { url, es, delegate, boundTypes };
    this.channels.set(url, ch);
    return delegate;
  }

  closeChannel(url: string) {
    const ch = this.channels.get(url);
    if (!ch) return;
    try {
      ch.es.close();
    } catch {}
    ch.delegate.clearAll();
    this.channels.delete(url);
  }

  closeAll() {
    this.channels.forEach((ch) => {
      try {
        ch.es.close();
      } catch {}
      ch.delegate.clearAll();
    });
    this.channels.clear();
  }
}
