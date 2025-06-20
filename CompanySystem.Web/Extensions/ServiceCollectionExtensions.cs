using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Services;
using CompanySystem.Domain;
using CompanySystem.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CompanySystem.Domain.Options;

using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Web.BackgroundServices;

namespace CompanySystem.Web.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static WebApplicationBuilder AddSwagger(this WebApplicationBuilder builder)
        {
            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Orders API",
                    Version = "v1"
                });

                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });

                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            return builder;
        }

        public static WebApplicationBuilder AddData(this WebApplicationBuilder builder)
        {
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<CompanySystemContext>(opt =>
                opt.UseNpgsql(connectionString));

            return builder;
        }

        public static WebApplicationBuilder AddApplicationServices(this WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<IBreakdownsService, BreakdownsService>();
            builder.Services.AddScoped<IEmployeeService, EmployeesService>();
            builder.Services.AddScoped<IDepartmentService, DepartmentService>();
            builder.Services.AddScoped<IUserService, UserService>();

            return builder;
        }

        public static WebApplicationBuilder AddIntegrationServices(this WebApplicationBuilder builder)
        {
            return builder;
        }

        public static WebApplicationBuilder AddBackgroundService(this WebApplicationBuilder builder)
        {
            builder.Services.AddHostedService<CreateBreakdownConsumer>();
            return builder;
        }

        public static WebApplicationBuilder AddBearerAuthentication(this WebApplicationBuilder builder)
        {
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
               .AddJwtBearer(options =>
               {
                   options.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateIssuer = true,
                       ValidateAudience = true,
                       ValidateLifetime = true,
                       ValidateIssuerSigningKey = true,
                       ValidIssuer = builder.Configuration["AppSettings:Issuer"],
                       ValidAudience = builder.Configuration["AppSettings:Audience"],
                       IssuerSigningKey = new SymmetricSecurityKey(
                           Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]))
                   };
               });
            builder.Services.AddScoped<IAuthService, AuthService>();
            return builder;
        }

        public static WebApplicationBuilder AddOptions(this WebApplicationBuilder builder)
        { 
            builder.Services.Configure<RabbitMqOptions>(builder.Configuration.GetSection("RabbitMQ"));
            return builder;
        }
    }
}
