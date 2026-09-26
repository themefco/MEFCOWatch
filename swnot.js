const MEFCO_BASE = '/MEFCOWatch/';

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      body: event.data ? event.data.text() : ''
    };
  }

  const title = data.title || 'MEFCO Watch';

  const options = {
    body: data.body || 'A new MEFCO Watch update is available.',
    icon: data.icon || `${MEFCO_BASE}favicon.ico`,
    badge: data.badge || `${MEFCO_BASE}favicon.ico`,
    tag: data.tag || 'mefco-watch',
    renotify: Boolean(data.renotify),
    data: {
      url: data.url || MEFCO_BASE
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url || MEFCO_BASE;

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (
            'navigate' in client &&
            client.url !== targetUrl
          ) {
            return client.navigate(targetUrl)
              .then(() => client.focus());
          }

          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    })
  );
});
