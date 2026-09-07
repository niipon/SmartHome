using Microsoft.AspNetCore.Mvc;
using SmartHome.Models;
using SmartHome.Data;
using Microsoft.EntityFrameworkCore;

namespace SmartHome.Controllers;

[ApiController]
[Route("api/home")]
public class HomeController : ControllerBase 
{
    private readonly AppDbContext _db;

    public HomeController(AppDbContext db)
    {
        _db = db;
    }

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
    public IActionResult UpdateHomeState([FromBody] HomeState state)
    {
        state.UpdatedAt = DateTime.Now;

        currentState = state;

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

}
