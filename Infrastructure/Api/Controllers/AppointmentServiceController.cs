using Aplication.Attributes.Authorization;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.AppointmentServiceDto;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentServiceController : ControllerBase
{
    private readonly AppointmentServiceService _appointmentServiceService;
    private readonly ILogger<AppointmentServiceController> _logger;
    private readonly ICacheService _cacheService;

    public AppointmentServiceController(
        AppointmentServiceService appointmentServiceService,
        ILogger<AppointmentServiceController> logger,
        ICacheService cacheService)
    {
        _appointmentServiceService = appointmentServiceService;
        _logger = logger;
        _cacheService = cacheService;
    }

    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _appointmentServiceService.GetAllAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching all appointment services");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeNoSub]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        try
        {
            var cached = await _cacheService.GetAsync<AppointmentServiceReadDto>($"appointmentservices:{id}");
            if (cached != null) return Ok(cached);

            var result = await _appointmentServiceService.GetByIdAsync(id);
            await _cacheService.SetAsync($"appointmentservices:{id}", result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching appointment service {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] AppointmentServiceCreateDto dto)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var result = await _appointmentServiceService.CreateAsync(dto);
            await _cacheService.RemoveAsync($"appointmentservices:appointment:{dto.AppointmentId}");
            await _cacheService.RemoveAsync($"appointmentservices:{companyId}:all");
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating appointment service");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update([FromBody] AppointmentServiceUpdateDto dto, [FromRoute] Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            await _appointmentServiceService.UpdateAsync(dto, id);
            await _cacheService.RemoveAsync($"appointmentservices:{id}");
            await _cacheService.RemoveAsync($"appointmentservices:{companyId}:all");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating appointment service {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            await _appointmentServiceService.DeleteAsync(id);
            await _cacheService.RemoveAsync($"appointmentservices:{id}");
            await _cacheService.RemoveAsync($"appointmentservices:{companyId}:all");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting appointment service {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeNoSub]
    [HttpGet("GetByAppointment/{appointmentId}")]
    public async Task<IActionResult> GetByAppointment([FromRoute] Guid appointmentId)
    {
        try
        {
            var cacheKey = $"appointmentservices:appointment:{appointmentId}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<AppointmentServiceReadDto>>(cacheKey);
            if (cached != null) return Ok(cached);

            var result = await _appointmentServiceService.GetByAppointmentAsync(appointmentId);
            await _cacheService.SetAsync(cacheKey, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching appointment services for appointmentId: {appointmentId}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeNoSub]
    [HttpGet("GetByService/{serviceId}")]
    public async Task<IActionResult> GetByService([FromRoute] Guid serviceId)
    {
        try
        {
            var cacheKey = $"appointmentservices:service:{serviceId}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<AppointmentServiceReadDto>>(cacheKey);
            if (cached != null) return Ok(cached);

            var result = await _appointmentServiceService.GetByServiceAsync(serviceId);
            await _cacheService.SetAsync(cacheKey, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching appointment services for serviceId: {serviceId}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeNoSub]
    [HttpGet("CalculateTotal/{appointmentId}")]
    public async Task<IActionResult> CalculateTotal([FromRoute] Guid appointmentId)
    {
        try
        {
            var total = await _appointmentServiceService.CalculateAppointmentTotalAsync(appointmentId);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while calculating total for appointmentId: {appointmentId}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeNoSub]
    [HttpGet("CalculateRevenue/{serviceId}")]
    public async Task<IActionResult> CalculateRevenue([FromRoute] Guid serviceId)
    {
        try
        {
            var total = await _appointmentServiceService.CalculateTotalRevenueForServiceAsync(serviceId);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while calculating revenue for serviceId: {serviceId}");
            return StatusCode(500, ex.Message);
        }
    }
}
