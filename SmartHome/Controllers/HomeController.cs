using Microsoft.AspNetCore.Mvc;
using SmartHome.Models;

namespace SmartHome.Controllers;

[ApiController]
[Route("api/home")]
public class HomeController : ControllerBase
{
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
