using System.Text;
using Aplication.Interfaces;
using Aplication.Interfaces.Repository;
using Aplication.Mapping;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using CrmPridnestrovye.Dal.Repositories;
using CrmPridnestrovye.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

#region  Repositories

builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderServiceRepository, OrderServiceRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVerificationCodeRepository,VerificationCodeRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

#endregion

#region Other

builder.Services.AddDbContext<ProjectDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CRM API", Version = "v1" });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token starting with 'Bearer' (eg Bearer eyJhbGciOi...)"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            Array.Empty<string>()
        }
    });
});


#endregion

#region Services

builder.Services.AddScoped<AppointmentService>();
builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<CompanyService>();
builder.Services.AddScoped<OrderServices>();
builder.Services.AddScoped<OrderServiceService>();
builder.Services.AddScoped<ServiceService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<VerificationService>(); 
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IReportService, ReportService>();

builder.Services.AddHostedService<SubscriptionDeactivationService>();

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo("/app/keys"))
    .SetApplicationName("CRM");

#endregion

#region Mappers

builder.Services.AddAutoMapper(typeof(AppointmentProfile), typeof(ClientProfile));
builder.Services.AddAutoMapper(typeof(CompanyProfile), typeof(OrderProfile));
builder.Services.AddAutoMapper(typeof(OrderServiceProfile), typeof(ServiceProfile));
builder.Services.AddAutoMapper(typeof(UserProfile),typeof(VerificationCodeProfile));

#endregion

#region Cache

builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "crm-redis";
});

#endregion

#region Auth

var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JwtSettings__Secret") ??
                    throw new Exception("Failed to get keyword"))
            )
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("Html", builder =>
    {
        builder.WithOrigins("http://localhost:5000")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
    
    options.AddPolicy("Dev", builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});




#endregion

#region StartUp

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ProjectDbContext>();
    try 
    {
        Console.WriteLine("Applying migrations...");
        await dbContext.Database.MigrateAsync();
        Console.WriteLine("Migrations applied successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration failed: {ex.Message}");
        throw;
    }
}

app.UseRouting();

app.UseCors("Dev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

#endregion