using Aplication.Attributes.Authorization;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.OrderDto;
using Shared.Dtos.OrderServiceDto;
using Shared.Enums;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class OrderController : ControllerBase
{
    private readonly OrderServices _orderServices;
    private readonly ILogger<OrderController> _logger;
    private readonly ICacheService _cacheService;

    public OrderController(OrderServices orderServices, ILogger<OrderController> logger, ICacheService cacheService)
    {
        _orderServices = orderServices;
        _logger = logger;
        _cacheService = cacheService;
    }

    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var ordersFromDb = await _orderServices.GetAllAsync();
            return Ok(ordersFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching all orders");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById([FromRoute]Guid id)
    {
        try
        {
            var cached = await _cacheService.GetAsync<OrderReadDto>($"orders:{id}");
            if (cached != null)
            {
                return Ok(cached);
            }

            var orderFromDb = await _orderServices.GetByIdAsync(id);
            if (orderFromDb == null)
                return NotFound();

            await _cacheService.SetAsync($"orders:{id}", orderFromDb);

            return Ok(orderFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching order with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] OrderCreateDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var order = await _orderServices.CreateOrderAsync(request,companyId);
            await _cacheService.RemoveAsync($"orders:{companyId}:all");
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating order");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update([FromBody] OrderUpdateDto request,[FromRoute] Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            await _orderServices.UpdateAsync(request,companyId,id);
            await _cacheService.RemoveAsync($"orders:{companyId}:all");
            await _cacheService.RemoveAsync($"orders:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating order with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete([FromRoute]Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _orderServices.DeleteAsync(id);
            await _cacheService.RemoveAsync($"orders:{companyId}:all");
            await _cacheService.RemoveAsync($"orders:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting order with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("AddService")]
    public async Task<IActionResult> AddService([FromBody] OrderServiceCreateDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _orderServices.AddServiceToOrderAsync(request);
            await _cacheService.RemoveAsync($"orders:{companyId}:all");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while adding service to order");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("Complete/{id}")]
    public async Task<IActionResult> Complete([FromRoute]Guid id)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);
            await _orderServices.CompleteOrderAsync(id);
            await _cacheService.RemoveAsync($"orders:{companyId}:all");
            await _cacheService.RemoveAsync($"orders:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while completing order with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("GetByCompany")]
    public async Task<IActionResult> GetByCompany()
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"orders:{companyId}:all";
            var cached = await _cacheService.GetAsync<IReadOnlyList<OrderReadDto>>(cacheKey);
            if (cached != null)
            {
                return Ok(cached);
            }

            var ordersFromDb = await _orderServices.GetByCompanyAsync(companyId);
            await _cacheService.SetAsync(cacheKey, ordersFromDb);

            return Ok(ordersFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching orders for company");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("GetByClient/{clientId}")]
    public async Task<IActionResult> GetByClient([FromRoute]Guid clientId)
    {
        try
        {
            var ordersFromDb = await _orderServices.GetByClientAsync(clientId);
            return Ok(ordersFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching orders for clientId: {clientId}");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("GetByStatus")]
    public async Task<IActionResult> GetByStatus([FromQuery] StatusOfWork status, [FromQuery] Guid companyId)
    {
        try
        {
            var ordersFromDb = await _orderServices.GetByStatusAsync(status, companyId);
            return Ok(ordersFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching orders by status");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("GetByDateRange")]
    public async Task<IActionResult> GetByDateRange([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var ordersFromDb = await _orderServices.GetByDateRangeAsync(start, end, companyId);
            return Ok(ordersFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching orders by date range");
            return StatusCode(500, ex.Message);
        }
    }
}
