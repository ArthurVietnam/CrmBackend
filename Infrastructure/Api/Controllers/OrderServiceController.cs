using Aplication.Attributes.Authorization;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.OrderServiceDto;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class OrderServiceController : ControllerBase
{
    private readonly OrderServiceService _orderServiceService;
    private readonly ILogger<OrderServiceController> _logger;
    private readonly ICacheService _cacheService;

    public OrderServiceController(OrderServiceService orderServiceService, ILogger<OrderServiceController> logger, ICacheService cacheService)
    {
        _orderServiceService = orderServiceService;
        _logger = logger;
        _cacheService = cacheService;
    }

    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var orderServicesFromDb = await _orderServiceService.GetAllAsync();
            return Ok(orderServicesFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching all order services");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById([FromRoute]Guid id)
    {
        try
        {
            var cached = await _cacheService.GetAsync<OrderServiceReadDto>($"orderservices:{id}");
            if (cached != null)
            {
                return Ok(cached);
            }

            var orderServiceFromDb = await _orderServiceService.GetByIdAsync(id);
            if (orderServiceFromDb == null)
                return NotFound();

            await _cacheService.SetAsync($"orderservices:{id}", orderServiceFromDb);

            return Ok(orderServiceFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching order service with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] OrderServiceCreateDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var orderService = await _orderServiceService.CreateAsync(request);
            await _cacheService.RemoveAsync($"orderservices:{companyId}:all");
            return CreatedAtAction(nameof(GetById), new { id = orderService.Id }, orderService);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating order service");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update([FromBody] OrderServiceUpdateDto request,[FromRoute] Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            await _orderServiceService.UpdateAsync(request,id);
            await _cacheService.RemoveAsync($"orderservices:{companyId}all");
            await _cacheService.RemoveAsync($"orderservices:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating order service with id {id}");
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

            await _orderServiceService.DeleteAsync(id);
            await _cacheService.RemoveAsync($"orderservices:{companyId}all");
            await _cacheService.RemoveAsync($"orderservices:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting order service with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("GetByOrder/{orderId}")]
    public async Task<IActionResult> GetByOrder([FromRoute]Guid orderId)
    {
        try
        {
            var cacheKey = $"orderservices:order:{orderId}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<OrderServiceReadDto>>(cacheKey);
            if (cached != null)
            {
                return Ok(cached);
            }

            var orderServicesFromDb = await _orderServiceService.GetByOrderAsync(orderId);
            await _cacheService.SetAsync(cacheKey, orderServicesFromDb);

            return Ok(orderServicesFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching order services for orderId: {orderId}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("GetByService/{serviceId}")]
    public async Task<IActionResult> GetByService([FromRoute]Guid serviceId)
    {
        try
        {
            var cacheKey = $"orderservices:service:{serviceId}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<OrderServiceReadDto>>(cacheKey);
            if (cached != null)
            {
                return Ok(cached);
            }

            var orderServicesFromDb = await _orderServiceService.GetByServiceAsync(serviceId);
            await _cacheService.SetAsync(cacheKey, orderServicesFromDb);

            return Ok(orderServicesFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching order services for serviceId: {serviceId}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("CalculateTotal/{orderId}")]
    public async Task<IActionResult> CalculateOrderTotal([FromRoute]Guid orderId)
    {
        try
        {
            var total = await _orderServiceService.CalculateOrderTotalAsync(orderId);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while calculating total for orderId: {orderId}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("CalculateRevenue/{serviceId}")]
    public async Task<IActionResult> CalculateTotalRevenue([FromRoute]Guid serviceId)
    {
        try
        {
            var totalRevenue = await _orderServiceService.CalculateTotalRevenueForServiceAsync(serviceId);
            return Ok(totalRevenue);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while calculating total revenue for serviceId: {serviceId}");
            return StatusCode(500, ex.Message);
        }
    }
}
