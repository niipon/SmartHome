using System.ComponentModel.DataAnnotations;

namespace SmartHome.Models;

public class User
{
    public int Id { get; set; }


[Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string Role { get; set; } = "Пользователь";

    public bool IsActive { get; set; } = true;

    public bool CanControlHome { get; set; } = true;

    public bool CanControlSecurity { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastActive { get; set; }


}
