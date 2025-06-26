using CompanySystem.Web.Extensions;
using Microsoft.AspNetCore.HttpLogging;

namespace CompanySystem.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddHttpLogging(opt =>
            {
                opt.LoggingFields = HttpLoggingFields.RequestBody | HttpLoggingFields.RequestHeaders |
                                    HttpLoggingFields.Duration | HttpLoggingFields.RequestPath | HttpLoggingFields.ResponseBody |
                                    HttpLoggingFields.ResponseHeaders;
            });

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:5173");
                    policy.AllowAnyHeader();
                    policy.AllowAnyMethod();
                    policy.WithExposedHeaders("X-Pagination");
                });
            });


            builder
                .AddBearerAuthentication()
                //.AddOptions()
                .AddSwagger()
                .AddData()
                .AddApplicationServices()
                //.AddBackgroundService()
                .AddIntegrationServices();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();
            app.UseHttpsRedirection();


            app.UseCors();

            app.Run();
        }
    }
}
