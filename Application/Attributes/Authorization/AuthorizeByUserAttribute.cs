using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Aplication.Attributes.Authorization;

public class AuthorizeByUserAttribute : AuthorizeAttribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        if (!user.Identity?.IsAuthenticated ?? false)
        {
            context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
            return;
        }

        var isUser = user.Claims.Any(c => (c.Type == "role" || c.Type == ClaimTypes.Role) && c.Value == "User");
        var isCompany = user.Claims.Any(c => (c.Type == "role" || c.Type == ClaimTypes.Role) && c.Value == "Company");

        if (!isUser && !isCompany)
        {
            context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
        }
    }
}