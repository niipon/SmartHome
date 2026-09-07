self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    // Обычные запросы пропускаем дальше
});

self.addEventListener("push", event => {
    if (!event.data) {
        return;
    }

    const data = event.data.json();

    const title = data.title || "SmartHome";

    const options = {
        body: data.body || "",
        icon: "/smart.png",
        badge: "/smart.png",
        data: {
            url: data.url || "/notifications"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    const url = event.notification.data?.url || "/notifications";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(windowClients => {

            for (const client of windowClients) {
                if ("focus" in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});