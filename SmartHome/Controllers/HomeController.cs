using Microsoft.AspNetCore.Mvc;
using SmartHome.Models;
using SmartHome.Data;
using SmartHome.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace SmartHome.Controllers;

[ApiController]
[Route("api/home")]
public class HomeController : ControllerBase 
{

    private readonly AppDbContext _db;
    private readonly PushNotificationService _pushService;

    public HomeController(
    AppDbContext db,
    PushNotificationService pushService)
    {
        _db = db;
        _pushService = pushService;
    }

    private static bool gasNotificationSent = false;
    private static bool motionNotificationSent = false;

    private static HomeState currentState = new HomeState
    {
        IndoorTemperature = 0,
        OutdoorTemperature = 0,
        Humidity = 0,
        GasValue = 0,
        GasDetected = false,
        MotionDetected = false,
        SecurityEnabled = false,
        UpdatedAt = DateTime.Now
    };

    [HttpPost("push-subscription")]
    public async Task<IActionResult> SavePushSubscription(
    [FromBody] PushSubscription subscription)
    {
        var existing = await _db.PushSubscriptions
            .FirstOrDefaultAsync(x => x.Endpoint == subscription.Endpoint);

        if (existing == null)
        {
            _db.PushSubscriptions.Add(subscription);
            await _db.SaveChangesAsync();
        }

        return Ok();
    }

    // ESP32 отправляет сюда данные
    [HttpPost]
    public async Task<IActionResult> UpdateHomeState([FromBody] HomeState state)
    {
        state.UpdatedAt = DateTime.Now;

        currentState = state;



        // 🔥 Газ обнаружен
        if (state.GasDetected && !gasNotificationSent)
        {
            gasNotificationSent = true;

            _db.HomeNotifications.Add(new HomeNotification
            {
                Title = "ОБНАРУЖЕН ГАЗ!",
                Description = "Датчик газа обнаружил опасный уровень газа",
                Icon = "🔥",
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            var subscriptions = await _db.PushSubscriptions.ToListAsync();

            foreach (var subscription in subscriptions)

                try {
                    
                        await _pushService.SendAsync(
                            subscription.Endpoint,
                            subscription.P256dh,
                            subscription.Auth,
                            "🔥 ОПАСНОСТЬ!",
                            "Датчик обнаружил газ в доме!"
                        );
                    
                }
                catch 
                {
                    
            }
        
        }

        // Газ больше не обнаружен — разрешаем следующее уведомление
        if (!state.GasDetected)
        {
            gasNotificationSent = false;
        }

        

        // 👀 Движение при включённой охране
        if (state.SecurityEnabled && state.MotionDetected && !motionNotificationSent)
        {
            motionNotificationSent = true;

            _db.HomeNotifications.Add(new HomeNotification
            {
                Title = "ДВИЖЕНИЕ ОБНАРУЖЕНО!",
                Description = "Датчик движения обнаружил активность при включённой охране",
                Icon = "👀",
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();


            var subscriptions = await _db.PushSubscriptions.ToListAsync();

            foreach (var subscription in subscriptions)

                try
                {
                    await _pushService.SendAsync(
                    subscription.Endpoint,
                    subscription.P256dh,
                    subscription.Auth,
                    "👀 ДВИЖЕНИЕ!",
                    "Датчик движения обнаружил активность при включённой охране!"
                );
                }
                catch
                {

                }
                
            
        }

        if (!state.SecurityEnabled || !state.MotionDetected)
        {
            motionNotificationSent = false;
        }

        // Охрана выключена или движения больше нет — разрешаем следующее уведомление
        if (!state.SecurityEnabled || !state.MotionDetected)
        {
            motionNotificationSent = false;
        }

        return Ok(new
        {
            message = "Данные получены"
        });
    }

    [HttpPost("security")]
    public IActionResult SetSecurity([FromBody] bool enabled)
    {
        currentState.SecurityEnabled = enabled;

        return Ok(currentState);
    }


    // Blazor получает отсюда данные
    [HttpGet]
    public IActionResult GetHomeState()
    {
        return Ok(currentState);
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications()
    {
        var notifications = await _db.HomeNotifications
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(notifications);
    }

}
