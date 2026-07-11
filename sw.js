self.addEventListener('push', (event) => {
  console.log('[sw] push event diterima, raw text:', event.data ? event.data.text() : '(kosong)');

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error('[sw] gagal parse push data sebagai JSON:', e);
  }

  const title = data.title || 'RMRN';
  const options = {
    body: data.body || '',
    icon: '/icon-192.png', // ganti sesuai icon lo, atau hapus baris ini kalau belum ada filenya
    badge: '/icon-192.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(
    self.registration.showNotification(title, options).catch((e) => {
      console.error('[sw] showNotification gagal:', e);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
