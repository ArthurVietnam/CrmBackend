using Aplication.Attributes.Authorization;
using Aplication.Exceptions;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.UserDto;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<UserController> _logger;
    private readonly ICacheService _cacheService;

    public UserController(UserService userService, ILogger<UserController> logger, ICacheService cacheService)
    {
        _userService = userService;
        _logger = logger;
        _cacheService = cacheService;
    }

    [AuthorizeByCompany]
    [HttpPost("UserCreate")]
    public async Task<IActionResult> UserCreate([FromBody] UserCreateDto dto)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            
            var user = await _userService.CreateAsync(dto,companyId);
            await _cacheService.RemoveAsync($"users:{companyId}:all");
            return CreatedAtAction(
                actionName: nameof(UserController.GetById),
                controllerName: "User",
                routeValues: new { id = user.Id },
                value: user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating user");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByCompany]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById([FromRoute]Guid id)
    {
        try
        {
            var cacheKey = $"users:{id}";
            var cached = await _cacheService.GetAsync<UserReadDto>(cacheKey);
            if (cached != null)
                return Ok(cached);

            var user = await _userService.GetByIdAsync(id);
            await _cacheService.SetAsync(cacheKey, user);
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching user with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByCompany]
    [HttpPut("Update")]
    public async Task<IActionResult> Update([FromBody] UserUpdateDto dto)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _userService.UpdateAsync(dto, companyId);
            await _cacheService.RemoveAsync($"users:{dto.Id}");
            await _cacheService.RemoveAsync($"users:{companyId}:all");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating user with id {dto.Id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByCompany]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete([FromQuery] Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _userService.DeleteAsync(id);
            await _cacheService.RemoveAsync($"users:{id}");
            await _cacheService.RemoveAsync($"users:{companyId}:all");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting user with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByCompany]
    [HttpGet("GetByCompany")]
    public async Task<IActionResult> GetByCompany()
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            var cacheKey = $"users:{companyId}:all";
            var cached = await _cacheService.GetAsync<IReadOnlyList<UserReadDto>>(cacheKey);
            if (cached != null)
                return Ok(cached);

            var users = await _userService.GetByCompanyAsync(companyId);
            await _cacheService.SetAsync(cacheKey, users);
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching users for company");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPut("UpdatePassword/{userId}")]
    public async Task<IActionResult> UpdatePassword([FromRoute]Guid userId, [FromQuery] string newPassword)
    {
        try
        {
            await _userService.UpdatePasswordAsync(userId, newPassword);
            await _cacheService.RemoveAsync($"users:{userId}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating password for user {userId}");
            return StatusCode(500, ex.Message);
        }
    }
}
