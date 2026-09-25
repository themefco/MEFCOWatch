self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      body: event.data?.text?.() || ''
    };
  }

  const title = data.title || 'MEFCO Watch';

  const options = {
    body: data.body || 'A new MEFCO Watch update is available.',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    tag: data.tag || 'mefco-watch',
    data: {
      url: data.url || '/'
    },
    renotify: !!data.renotify
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification?.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(list => {
      for (const client of list) {
        if ('focus' in client) {
          if ('navigate' in client && client.url !== url) {
            client.navigate(url);
          }

          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});
