using Aplication.Attributes.Authorization;
using Aplication.Exceptions;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.ServiceDto;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ServiceController : ControllerBase
{
    private readonly ServiceService _serviceService;
    private readonly ILogger<ServiceController> _logger;
    private readonly ICacheService _cacheService;

    public ServiceController(ServiceService serviceService, ILogger<ServiceController> logger, ICacheService cacheService)
    {
        _serviceService = serviceService;
        _logger = logger;
        _cacheService = cacheService;
    }

    [AuthorizeByUser]
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] ServiceCreateDto dto)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var result = await _serviceService.CreateAsync(dto,companyId);
            await _cacheService.RemoveAsync($"services:{companyId}:all");
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating service");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById([FromRoute]Guid id)
    {
        try
        {
            var cached = await _cacheService.GetAsync<ServiceReadDto>($"services:{id}");
            if (cached != null)
                return Ok(cached);

            var result = await _serviceService.GetByIdAsync(id);
            if (result == null)
                return NotFound();

            await _cacheService.SetAsync($"services:{id}", result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching service {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPut("Update")]
    public async Task<IActionResult> Update([FromBody] ServiceUpdateDto dto)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _serviceService.UpdateAsync(dto,companyId);
            await _cacheService.RemoveAsync($"services:{dto.Id}");
            await _cacheService.RemoveAsync($"services:{companyId}:all");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating service {dto.Id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete([FromRoute]Guid id)
    {
        try
        {
            await _serviceService.DeleteAsync(id);
            await _cacheService.RemoveAsync($"services:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting service {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("Popular")]
    public async Task<IActionResult> GetPopular([FromQuery] int count = 5)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"services:popular:{companyId}:{count}";
            var cached = await _cacheService.GetAsync<IEnumerable<ServiceReadDto>>(cacheKey);
            if (cached != null)
                return Ok(cached);

            var result = await _serviceService.GetPopularServicesAsync(companyId, count);
            await _cacheService.SetAsync(cacheKey, result, 5);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching popular services for company");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("Search")]
    public async Task<IActionResult> Search([FromQuery] string term)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"services:search:{companyId}:{term.ToLower()}";
            var cached = await _cacheService.GetAsync<IEnumerable<ServiceReadDto>>(cacheKey);
            if (cached != null)
                return Ok(cached);

            var result = await _serviceService.SearchAsync(term, companyId);
            await _cacheService.SetAsync(cacheKey, result, 5);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while searching services");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("GetByCompany")]
    public async Task<IActionResult> GetByCompany()
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"services:{companyId}:all";
            var cached = await _cacheService.GetAsync<IEnumerable<ServiceReadDto>>(cacheKey);
            if (cached != null)
                return Ok(cached);

            var result = await _serviceService.GetByCompanyAsync(companyId);
            await _cacheService.SetAsync(cacheKey, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching services by company");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("GetByDateRange")]
    public async Task<IActionResult> GetByDateRange([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var result = await _serviceService.GetServicesByDateRangeAsync(start, end, companyId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching services by date range");
            return StatusCode(500, ex.Message);
        }
    }
}
