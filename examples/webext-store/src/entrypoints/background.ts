import { storage } from 'webext-store';
import { heartbeatItem, installIdItem, settingsItem } from '@/utils/storage-items';

/**
 * Background / service worker guide
 * ----------------------------------
 * MV3 service workers are NOT long-lived — the browser kills and restarts
 * them whenever it wants (idle timeout, memory pressure, etc). Nothing you
 * hold in a plain JS variable here survives that. `webext-store` items do,
 * because every read/write goes straight to `browser.storage`, not to
 * in-memory state — that's *why* storage, not module-level variables, is
 * the right place for anything the background needs to remember.
 *
 * Three separate lifecycle hooks matter here, and it's easy to conflate
 * them:
 *   - `defineBackground(() => {...})` body — runs every time this service
 *     worker (re)starts. Put subscriptions (`.watch()`) and alarm/message
 *     listeners here — they need to be re-registered on every restart.
 *   - `browser.runtime.onInstalled` — runs once on install, and once per
 *     extension update. This is the correct place for one-time setup and
 *     for forcing migrations before anything else touches the data.
 *   - `browser.alarms` — MV3's replacement for `setInterval` in a service
 *     worker; a plain `setInterval` gets thrown away the moment the worker
 *     is killed, `alarms` survives restarts because the browser itself
 *     schedules them.
 */
export default defineBackground(() => {
  console.log('[webext-store-demo] background started');

  // Runs once per install and once per update — not on every worker
  // restart. Good place to force migrations/init ahead of anything else,
  // and to tell fresh installs apart from updates.
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
      console.log('[webext-store-demo] first install');
    } else if (reason === 'update') {
      console.log('[webext-store-demo] updated — running pending migrations');
    }
    settingsItem.migrate();
  });

  // `defineItem()` also runs pending migrations lazily the first time it's
  // touched, so this isn't strictly required — but calling it explicitly on
  // every worker start (not just on install/update) means it's guaranteed
  // to have happened before anything below reads `settingsItem`.
  settingsItem.migrate();

  // `init` items resolve themselves on first access too — this just forces
  // that to happen immediately, so the install ID exists right away rather
  // than waiting for the first `getValue()` call from elsewhere.
  installIdItem.getValue().then((id) => {
    console.log('[webext-store-demo] install id:', id);
  });

  // Prove `storage.watch` works from the background too, not just from
  // React — this logs every change made from ANY context (popup included).
  // Must be re-registered here, in the function body, every time the
  // worker restarts — a watcher set up once and "remembered" doesn't
  // survive the worker being killed.
  const unwatchHeartbeat = heartbeatItem.watch((newValue, oldValue) => {
    console.log(`[webext-store-demo] heartbeat: ${oldValue} -> ${newValue}`);
  });

  // Periodic write, entirely independent of the popup being open. If you
  // have the popup open with the "Cross-context" tab active, you'll see
  // this tick up on its own every few seconds. `alarms.create` is
  // idempotent by name, so re-calling it on every worker restart is fine —
  // it won't create duplicate alarms.
  browser.alarms.create('heartbeat', { periodInMinutes: 0.05 }); // ~3s
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== 'heartbeat') return;
    const current = await heartbeatItem.getValue();
    await heartbeatItem.setValue(current + 1);
  });

  // On-demand bump, triggered by a button in the popup — demonstrates a
  // write from the background being reflected live in the popup's UI via
  // `useStorage`'s built-in watch, with no manual message-passing needed on
  // the popup side to pick it up.
  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === 'bump-heartbeat') {
      return heartbeatItem.getValue().then((current) => heartbeatItem.setValue(current + 1));
    }
  });

  // Cleanup is mostly moot for a service worker (it's torn down by the
  // browser, not unmounted), but shown here for completeness / symmetry
  // with how you'd clean up a watcher anywhere else.
  self.addEventListener('beforeunload' as any, () => {
    unwatchHeartbeat();
    storage.unwatch();
  });
});
