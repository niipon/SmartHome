using System.Text.Json;
using Lib.Net.Http.WebPush;
using Lib.Net.Http.WebPush.Authentication;

namespace SmartHome.Services;

public class PushNotificationService
{
    private readonly PushServiceClient _pushClient;
    private readonly VapidAuthentication _vapid;

    public PushNotificationService(IConfiguration configuration)
    {
        _pushClient = new PushServiceClient();

        var publicKey = configuration["VAPID_PUBLIC_KEY"];
        var privateKey = configuration["VAPID_PRIVATE_KEY"];

        _vapid = new VapidAuthentication(
            publicKey,
            privateKey
        )
        {
            Subject = "https://smarthome-r4vs.onrender.com"
        };
    }

    public async Task SendAsync(
        string endpoint,
        string p256dh,
        string auth,
        string title,
        string body)
    {
        var subscription = new PushSubscription
        {
            Endpoint = endpoint,
            Keys = new Dictionary<string, string>
            {
                ["p256dh"] = p256dh,
                ["auth"] = auth
            }
        };

        var payload = JsonSerializer.Serialize(new
        {
            title,
            body,
            url = "/notifications"
        });

        var message = new PushMessage(payload)
        {
            TimeToLive = 60
        };

        await _pushClient.RequestPushMessageDeliveryAsync(
            subscription,
            message,
            _vapid
        );
    }
}