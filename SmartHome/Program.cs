//using SmartHome.Components;

//var builder = WebApplication.CreateBuilder(args);


//// Add services to the container.
//builder.Services.AddRazorComponents()
//    .AddInteractiveServerComponents();

//builder.Services.AddControllers();

//builder.Services.AddHttpClient("HomeApi", client =>
//{
//    client.BaseAddress = new Uri("http://localhost:5284/");
//});

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (!app.Environment.IsDevelopment())
//{
//    app.UseExceptionHandler("/Error", createScopeForErrors: true);
//    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
//    app.UseHsts();
//}

////app.UseHttpsRedirection();

//app.UseStaticFiles();
//app.UseAntiforgery();

//app.MapRazorComponents<App>()
//    .AddInteractiveServerRenderMode();

//app.MapControllers();

//app.Run();

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using SmartHome.Components;
using SmartHome.Data;
using SmartHome.Models;
using SmartHome.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<CurrentUserService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login";
        options.AccessDeniedPath = "/login";

        options.ExpireTimeSpan = TimeSpan.FromDays(30);
        options.SlidingExpiration = true;
    });

builder.Services.AddAuthorization();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddControllers();

builder.Services.AddHttpClient("HomeApi", client =>
{
    client.BaseAddress = new Uri("http://192.168.8.12:5284/");
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Users.Any())
    {
        db.Users.AddRange(

            new User
            {
                Name = "LEV",
                Email = "levv_999@mail.ru",
                Password = "01022010Lev@",
                Role = "Администратор",
                IsActive = true,
                CanControlHome = true,
                CanControlSecurity = true,
                CreatedAt = DateTime.UtcNow
            },

            new User
            {
                Name = "Konstantin",
                Email = "kostya-ataev@mail.ru",
                Password = "02012010Lev@",
                Role = "Пользователь",
                IsActive = true,
                CanControlHome = true,
                CanControlSecurity = true,
                CreatedAt = DateTime.UtcNow
            }

        );

        db.SaveChanges();
    }
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

// Пока HTTP, поэтому это убираем
// app.UseHttpsRedirection();

app.UseStaticFiles(); 

app.UseAuthentication();
app.UseAuthorization();

app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.MapControllers();



app.Run();