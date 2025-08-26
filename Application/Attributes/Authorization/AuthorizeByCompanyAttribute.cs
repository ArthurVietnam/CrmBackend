using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Aplication.Attributes.Authorization;

public class AuthorizeByCompanyAttribute : AuthorizeAttribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        if (!user.Identity?.IsAuthenticated ?? false)
        {
            context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
            return;
        }

        var isCompany = user.Claims.Any(c => 
            (c.Type == "role" || c.Type == ClaimTypes.Role) && c.Value == "Company");

        if (!isCompany)
        {
            context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
        }
    }
}