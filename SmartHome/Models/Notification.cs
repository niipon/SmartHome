using Microsoft.AspNetCore.Mvc;

namespace SmartHome.Models
{
    public class Notification
    {
           public int Id { get; set; }
        public string Title { get; set; }
        
        public string Icon { get; set; }
        public string Description { get; set; }

        public DateTime CreatedAt  { get; set; }
    }
}
