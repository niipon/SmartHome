window.pushNotifications = {

    subscribe: async function (publicKey) {

        if (!("serviceWorker" in navigator)) {
            throw new Error("Service Worker не поддерживается");
        }

        if (!("PushManager" in window)) {
            throw new Error("Push уведомления не поддерживаются");
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            throw new Error("Разрешение на уведомления не получено");
        }

        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(publicKey)
        });

        const json = subscription.toJSON();

        return {
            endpoint: json.endpoint,
            p256dh: json.keys.p256dh,
            auth: json.keys.auth
        };
    },

    urlBase64ToUint8Array: function (base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);

        return Uint8Array.from(
            [...rawData].map(char => char.charCodeAt(0))
        );
    }
};