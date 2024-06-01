using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Order.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// 添加数据库上下文和身份验证服务
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 21)),
    mysqlOptions =>
    {
        mysqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }));

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 1;
    options.Password.RequiredUniqueChars = 0;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<FileUploadOperationFilter>();
});
var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(s =>
    {
        s.RoutePrefix = string.Empty;
        s.SwaggerEndpoint("/swagger/v1/swagger.json", "MySite v1");
    });
}

app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

//app.UseHttpsRedirection(); //注释掉解决登陆问题,CORS跨域解决

// 这里是中间件的设置
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = "*";
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        if (context.Request.Method == "OPTIONS")
        {
            context.Response.StatusCode = 204;
            await context.Response.CompleteAsync();
        }
    }
    else
    {
        await next();
    }
});



app.UseCors("AllowAllOrigins");  // 将 UseCors 移动到这里

app.UseStaticFiles(); // 启用静态文件中间件


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();


public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // 获取所有来源于表单的参数
        var formParameters = context.ApiDescription.ParameterDescriptions
            .Where(p => p.Source == BindingSource.Form).ToList();

        // 如果存在表单参数
        if (formParameters.Count > 0)
        {
            // 创建 OpenApiRequestBody 并设置其内容为 multipart/form-data
            operation.RequestBody = new OpenApiRequestBody
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = formParameters.ToDictionary(
                                p => p.Name,
                                p => context.SchemaGenerator.GenerateSchema(p.ModelMetadata.ModelType, context.SchemaRepository)
                            )
                        }
                    }
                }
            };
        }
    }
}

