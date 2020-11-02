using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using sap_mock.Models;
using sap_mock.Services;
using Microsoft.Extensions.Logging;

namespace sap_mock
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<UserContext>(opt => opt.UseInMemoryDatabase("SAPP_DB"));
            services.AddScoped<UserService, UserService>();
            var context = services.BuildServiceProvider()
                       .GetService<UserService>();
            var logger = services.BuildServiceProvider()
                        .GetService<ILogger<MessagingService>>();
            services.AddControllers();
            services.AddSingleton<MessagingService>(new MessagingService(context, logger));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
