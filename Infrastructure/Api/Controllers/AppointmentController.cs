using Aplication.Attributes.Authorization;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.AppointmentDto;
using Shared.Enums;

namespace CrmPridnestrovye.Api.Controllers;
/// <summary>
///  TODOO логи сделать нормалтные
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AppointmentController : ControllerBase
{
    private readonly AppointmentService _appointmentService;
    private readonly ILogger<AppointmentController> _logger;
    private readonly ICacheService _cacheService;

    public AppointmentController(AppointmentService appointmentService, ILogger<AppointmentController> logger, ICacheService cacheService)
    {
        _appointmentService = appointmentService;
        _logger = logger;
        _cacheService = cacheService;
    }
    
    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _appointmentService.GetAllAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting all appointments.");
            return StatusCode(500, ex.Message);
        }
    }
    
    [AuthorizeByUser]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        try
        {
            var cacheKey = $"appointments:{id}";
            var cached = await _cacheService.GetAsync<AppointmentReadDto>(cacheKey);
            if (cached != null) return Ok(cached);

            var appointment = await _appointmentService.GetByIdAsync(id);
            await _cacheService.SetAsync(cacheKey, appointment);
            return Ok(appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting appointment {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var created = await _appointmentService.CreateAsync(dto,companyId);
            await _cacheService.RemoveAsync($"appointments:{companyId}:all");
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating appointment.");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update([FromBody] AppointmentUpdateDto dto,[FromRoute] Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            await _appointmentService.UpdateAsync(dto,companyId,id);
            await _cacheService.RemoveAsync($"appointments:{companyId}:all");
            await _cacheService.RemoveAsync($"appointments:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating appointment {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete([FromRoute]Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _appointmentService.DeleteAsync(id);
            await _cacheService.RemoveAsync($"appointments:{companyId}:all");
            await _cacheService.RemoveAsync($"appointments:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting appointment {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPut("Complete/{id}")]
    public async Task<IActionResult> Complete([FromRoute]Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _appointmentService.CompleteAppointmentAsync(id);
            await _cacheService.RemoveAsync($"appointments:{id}");
            await _cacheService.RemoveAsync($"appointments:{companyId}:all");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while completing appointment {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("ByDate")]
    public async Task<IActionResult> GetByDate([FromQuery] DateTime date)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"appointments:date:{companyId}:{date.Date:yyyyMMdd}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<AppointmentReadDto>>(cacheKey);
            if (cached != null) return Ok(cached);

            var result = await _appointmentService.GetByDateAsync(date, companyId);
            await _cacheService.SetAsync(cacheKey, result, 5);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting appointments by date for company");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("ByStatus")]
    public async Task<IActionResult> GetByStatus([FromQuery] StatusOfWork status)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"appointments:status:{companyId}:{status}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<AppointmentReadDto>>(cacheKey);
            if (cached != null) return Ok(cached);

            var result = await _appointmentService.GetByStatusAsync(status, companyId);
            await _cacheService.SetAsync(cacheKey, result, 5);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting appointments by status for company");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("ByClient/{clientId}")]
    public async Task<IActionResult> GetByClient([FromRoute]Guid clientId)
    {
        try
        {
            var result = await _appointmentService.GetByClientAsync(clientId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting appointments for client {clientId}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("ByService/{serviceId}")]
    public async Task<IActionResult> GetByService([FromRoute]Guid serviceId)
    {
        try
        {
            var result = await _appointmentService.GetByServiceAsync(serviceId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while getting appointments for service {serviceId}");
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

            var cacheKey = $"appointments:{companyId}:all";
            var cached = await _cacheService.GetAsync<IReadOnlyList<AppointmentReadDto>>(cacheKey);
            if (cached != null)
            {
                return Ok(cached);
            }

            var appointmentsFromDb = await _appointmentService.GetByCompany(companyId);
            await _cacheService.SetAsync(cacheKey, appointmentsFromDb);

            return Ok(appointmentsFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching appointments for company");
            return StatusCode(500, ex.Message);
        }
    }
}
