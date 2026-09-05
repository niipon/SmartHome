namespace SmartHome.Models;

public class HomeState
{
    public double IndoorTemperature { get; set; }

public double OutdoorTemperature { get; set; }

    public double Humidity { get; set; }

    public int GasValue { get; set; }

    public bool GasDetected { get; set; }

    public bool MotionDetected { get; set; }

    public bool SecurityEnabled { get; set; }

    public DateTime UpdatedAt { get; set; }

}
