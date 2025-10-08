using Aplication.Attributes.Authorization;
using Aplication.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.CompanyDto;
using Shared.Dtos.TokensRequsts;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly UserService _userService;
    private readonly CompanyService _companyService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(JwtService jwtService, UserService userService, CompanyService companyService, ILogger<AuthController> logger)
    {
        _jwtService = jwtService;
        _userService = userService;
        _companyService = companyService;
        _logger = logger;
    }

    [HttpPost("LoginByCompany")]
    public async Task<IActionResult> LoginByCompany([FromBody] AuthRequest request)
    {
        try
        {

            var company = await _companyService.LoginAsync(request.Email, request.Password);
            var accessToken = _jwtService.GenerateAccessToken(company.Id, company.Email, "Company",company.Id);
            var refreshToken = await _jwtService.GenerateRefreshToken(company.Id);

            return Ok(new { AccessToken = accessToken, RefreshToken = refreshToken });

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed");
            return StatusCode(500,ex.Message);
        }
    }

    [HttpPost("LoginByUser")]
    public async Task<IActionResult> LoginByUser([FromBody] AuthRequest request)
    {
        try
        {
            var user = await _userService.ValidateUserAsync(request.Email, request.Password);
            var companyId = await _userService.GetCompanyIdByEmail(request.Email);

            var accessToken = _jwtService.GenerateAccessToken(user.Id, user.Email, "User",companyId);
            var refreshToken = await _jwtService.GenerateRefreshToken(user.Id);

            return Ok(new { AccessToken = accessToken, RefreshToken = refreshToken });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed");
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpPost("CompanyCreate")]
    public async Task<IActionResult> CompanyCreate([FromBody] CompanyCreateDto request)
    {
        try
        {
            var company = await _companyService.CreateAsync(request);
            return StatusCode(201);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating company");
            return StatusCode(500, ex.Message);
        }
    }
    
    [HttpGet("CompanyRefresh")]
    public async Task<IActionResult> CompanyRefresh([FromQuery] RefreshRequest request)
    {
        try
        {
            
            var refreshToken = await _jwtService.GetRefreshTokenAsync(request.Token);
            if (refreshToken == null || refreshToken.ExpiryDate < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");

            var company = await _companyService.GetByIdAsync(refreshToken.UserId);
            if (!company.IsActive)
            {
                return Unauthorized("Out of subscribe");
            }
            

            var newAccess = _jwtService.GenerateAccessToken(refreshToken.UserId, company.Email, "Company",refreshToken.UserId);

            return Ok(new { AccessToken = newAccess});
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Token refresh failed");
            return StatusCode(500, ex.Message);
        }
    }
    
    
    [HttpGet("UserRefresh")]
    public async Task<IActionResult> UserRefresh([FromQuery] RefreshRequest request)
    {
        try
        {
            var refreshToken = await _jwtService.GetRefreshTokenAsync(request.Token);
            if (refreshToken == null || refreshToken.ExpiryDate < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");
            
            var user = await _userService.GetByIdAsync(refreshToken.UserId);
            var companyId = await _userService.GetCompanyIdByEmail(user.Email);

            var company = await _companyService.GetByIdAsync(companyId);
            if (!company.IsActive)
            {
                return Unauthorized("Out of subscribe");
            }
            
            var newAccess = _jwtService.GenerateAccessToken(user.Id, user.Email, user.Role.ToString(),companyId);

            return Ok(new { AccessToken = newAccess});
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Token refresh failed");
            return StatusCode(500, ex.Message);
        }
    }
}
