using FactoryApi.Application.Camera;
using FactoryApi.Hubs;
using FactoryApi.Infrastructure.Auth;
using FactoryApi.Infrastructure.CameraRuntime;
using FactoryApi.Infrastructure.MediaMtx;
using FactoryApi.Infrastructure.Persistence;
using FactoryApi.Services.CameraRuntime;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);


// ======================================================
// Controllers
// ======================================================
builder.Services.AddControllers();


// ======================================================
// Database
// ======================================================
builder.Services.AddDbContext<FactoryDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// ======================================================
// Dapper / Repository
// ======================================================
builder.Services.AddSingleton<SqlConnectionFactory>();
builder.Services.AddScoped<DeliveryRepository>();

builder.Services.AddScoped<JwtTokenService>();

var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ======================================================
// Logging
// ======================================================
// 로그 파일 경로: 바탕화면\logviewer.txt
//var desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
//var logPath = Path.Combine(desktopPath, "logviewer.txt");

//// 앱 시작 시 로그 초기화
//File.WriteAllText(
//    logPath,
//    $"=== FactoryApi START {DateTime.Now:yyyy-MM-dd HH:mm:ss} ==={Environment.NewLine}");

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// 파일 로그는 필요 시 다시 활성화
//builder.Logging.AddProvider(new SimpleFileLoggerProvider(logPath));

builder.Logging.SetMinimumLevel(LogLevel.Information);


// ======================================================
// OpenAPI / Swagger / https://localhost:7125/swagger
// ======================================================
builder.Services.AddOpenApi();

// Swagger UI가 필요해지면 아래 2줄 활성화
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ======================================================
// AddSignalR
// ======================================================
builder.Services.AddSignalR();

// ======================================================
// MediaMTX
// ======================================================
builder.Services.Configure<MediaMtxOptions>(
    builder.Configuration.GetSection("MediaMtx"));

builder.Services.AddSingleton<MediaMtxConfigWriter>();
//builder.Services.AddHostedService<MediaMtxService>();

// camera servcie
builder.Services.AddScoped<CameraQueryService>();
builder.Services.AddScoped<CameraDebugService>();
builder.Services.AddScoped<CameraImageService>();
builder.Services.AddScoped<CameraRoiService>();
builder.Services.AddScoped<CameraCommandService>();

// ======================================================
// Camera Runtime
// ======================================================
builder.Services.AddSingleton<SnapshotFileService>();
builder.Services.AddSingleton<ProductionPersistenceService>();
builder.Services.AddSingleton<CameraOrchestrator>();
//builder.Services.AddHostedService(sp => sp.GetRequiredService<CameraOrchestrator>());
builder.Services.AddSingleton<ILabelDetector, DummyLabelDetector>();

var app = builder.Build();


// ======================================================
// Development only
// ======================================================
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Swagger UI가 필요해지면 아래 2줄 활성화
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapHub<CameraHub>("/hubs/camera");

var logger = app.Services.GetRequiredService<ILoggerFactory>()
    .CreateLogger("RequestTrace");

var cs = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine("=== DefaultConnection ===");
Console.WriteLine(cs);

app.Use(async (context, next) =>
{
    Console.WriteLine($"[REQ] {context.Request.Method} {context.Request.Path}");

    await next();

    Console.WriteLine($"[RES] {context.Response.StatusCode} {context.Request.Path}");
});

// ======================================================
// Middleware
// ======================================================
//app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
 
app.Run();