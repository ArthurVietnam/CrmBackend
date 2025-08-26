using Aplication.Attributes.Authorization;
using Aplication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.CompanyDto;
using Shared.Enums;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CompanyController : ControllerBase
{
    private readonly CompanyService _companyService;
    private readonly ILogger<CompanyController> _logger;
    private readonly VerificationService _verificationService;

    public CompanyController(CompanyService companyService, ILogger<CompanyController> logger,VerificationService verificationService)
    {
        _companyService = companyService;
        _logger = logger;
        _verificationService = verificationService;
    }
    
    [EnableCors("Admin")]
    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var companies = await _companyService.GetAllAsync();
            return Ok(companies);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching all companies");
            return StatusCode(500, ex.Message);
        }
    }
    
    [EnableCors("Admin")]
    [Authorize(Roles = "SuperUser")]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var company = await _companyService.GetByIdAsync(id);
            return Ok(company);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching company with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [EnableCors("Admin")]
    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetByEmail/{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        try
        {
            var company = await _companyService.GetByEmailAsync(email);
            return Ok(company);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching company by email {email}");
            return StatusCode(500, ex.Message);
        }
    }

    [EnableCors("Admin")]
    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetActive")]
    public async Task<IActionResult> GetActiveCompanies()
    {
        try
        {
            var activeCompanies = await _companyService.GetActiveCompaniesAsync();
            return Ok(activeCompanies);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching active companies");
            return StatusCode(500, ex.Message);
        }
    }

    [EnableCors("Admin")]
    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetExpiredSubscriptions")]
    public async Task<IActionResult> GetExpiredSubscriptions()
    {
        try
        {
            var expiredCompanies = await _companyService.GetExpiredSubscriptionsAsync();
            return Ok(expiredCompanies);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching expired subscriptions");
            return StatusCode(500, ex.Message);
        }
    }
    

    [EnableCors("User")]
    [AuthorizeByCompany]
    [HttpPost("ResendCode")]
    public async Task<IActionResult> ResendCode([FromQuery] Guid companyId)
    {
        try
        {
            await _verificationService.ResendCodeAsync(companyId);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while resend code to company");
            return StatusCode(500, ex.Message);
        }
    }
    
    [EnableCors("User")]
    [AuthorizeByCompany]
    [HttpPost("ConfirmCode")]
    public async Task<IActionResult> ConfirmCode([FromQuery] Guid companyId,[FromQuery] string code)
    {
        try
        {
            await _verificationService.CheckCodeValidityAsync(companyId,code);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while confirm code to company");
            return StatusCode(500, ex.Message);
        }
    }
    
    [EnableCors("User")]
    [AuthorizeByCompany]
    [HttpPut("Update")]
    public async Task<IActionResult> Update([FromBody] CompanyUpdateDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            await _companyService.UpdateAsync(request,companyId);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating company with id {request.Email}");
            return StatusCode(500, ex.Message);
        }
    }

    [EnableCors("Admin")]
    [Authorize(Roles = "SuperUser")]
    [HttpPut("ExtendSubscription")]
    public async Task<IActionResult> ExtendSubscription([FromQuery] int months,[FromBody] Subscribes subscribe)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _companyService.ExtendSubscriptionAsync(companyId, months, subscribe);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while extending subscription for company");
            return StatusCode(500, ex.Message);
        }
    }

    [EnableCors("User")]
    [AuthorizeByCompany]
    [HttpDelete("Deactivate/{companyId}")]
    public async Task<IActionResult> Deactivate(Guid companyId)
    {
        try
        {
            await _companyService.DeactivateCompanyAsync(companyId);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deactivating company with id {companyId}");
            return StatusCode(500, ex.Message);
        }
    }

    [EnableCors("User")]
    [AuthorizeByCompany]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _companyService.DeleteAsync(id);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting company with id {id}");
            return StatusCode(500, ex.Message);
        }
    }
}
