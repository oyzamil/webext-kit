import { heartbeatItem } from '@/utils/storage-items';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_idle',

  main() {
    // No React here at all — proves webext-store's core API (storage /
    // defineItem) works in a plain content script, same as anywhere else.
    const badge = document.createElement('div');
    badge.setAttribute(
      'style',
      [
        'position:fixed',
        'bottom:12px',
        'right:12px',
        'z-index:2147483647',
        'padding:6px 10px',
        'border-radius:8px',
        'background:#1e293b',
        'color:#6ee7b7',
        'font:600 11px/1.4 monospace',
        'box-shadow:0 2px 8px rgba(0,0,0,.25)',
        'pointer-events:none',
        'opacity:0.85',
      ].join(';'),
    );
    badge.textContent = 'webext-store heartbeat: …';
    document.documentElement.appendChild(badge);

    const render = (n: number) => {
      badge.textContent = `webext-store heartbeat: ${n}`;
    };

    heartbeatItem.getValue().then(render);

    // Fires for writes from the background's alarm, the popup's button,
    // and the popup's hook — this content script sees all of them equally.
    const unwatch = heartbeatItem.watch((newValue) => render(newValue));

    // WXT tears content scripts down on navigation/invalidation for us;
    // this listener is just belt-and-suspenders cleanup.
    window.addEventListener('pagehide', unwatch, { once: true });
  },
});
