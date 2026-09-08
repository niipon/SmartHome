using System.ComponentModel.DataAnnotations;

namespace SmartHome.Models;

public class HomeNotification
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = "";

    [Required]
    public string Description { get; set; } = "";

    public string Icon { get; set; } = "🔔";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}