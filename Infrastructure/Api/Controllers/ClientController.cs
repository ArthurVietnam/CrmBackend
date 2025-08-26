using Aplication.Attributes.Authorization;
using Aplication.Services;
using CrmPridnestrovye.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos.ClientDto;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ClientController : ControllerBase
{
    private readonly ClientService _clientService;
    private readonly ILogger<ClientController> _logger;
    private readonly ICacheService _cacheService;

    public ClientController(ClientService clientService, ILogger<ClientController> logger, ICacheService cacheService)
    {
        _clientService = clientService;
        _logger = logger;
        _cacheService = cacheService;
    }
    
    [EnableCors("Admin")]
    [Authorize(Roles = "SuperUser")]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var cached = await _cacheService.GetAsync<IEnumerable<ClientReadDto>>("clients:all");
            if (cached != null)
            {
                return Ok(cached);
            }

            var clientsFromDb = await _clientService.GetAllAsync();
            await _cacheService.SetAsync("clients:all", clientsFromDb);

            return Ok(clientsFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching all clients");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("Get/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var cached = await _cacheService.GetAsync<ClientReadDto>($"clients:{id}");
            if (cached != null)
            {
                return Ok(cached);
            }

            var clientFromDb = await _clientService.GetByIdAsync(id);
            if (clientFromDb == null)
                return NotFound();

            await _cacheService.SetAsync($"clients:{id}", clientFromDb);

            return Ok(clientFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching client with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] ClientCreateDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var client = await _clientService.CreateAsync(request,companyId);
            await _cacheService.RemoveAsync("clients:all");
            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating client");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update([FromBody] ClientUpdateDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            await _clientService.UpdateAsync(request,companyId);
            await _cacheService.RemoveAsync("clients:all");
            await _cacheService.RemoveAsync($"clients:{request.Id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while updating client with id {request.Id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _clientService.DeleteAsync(id);
            await _cacheService.RemoveAsync("clients:all");
            await _cacheService.RemoveAsync($"clients:{id}");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while deleting client with id {id}");
            return StatusCode(500, ex.Message);
        }
    }

    [AuthorizeByUser]
    [HttpGet("Search")]
    public async Task<ActionResult<IReadOnlyList<ClientReadDto>>> Search([FromQuery] string searchTerm)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"clients:search:{companyId}:{searchTerm.ToLower()}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<ClientReadDto>>(cacheKey);
            if (cached != null)
            {
                return Ok(cached);
            }

            var resultFromDb = await _clientService.SearchAsync(searchTerm, companyId);
            await _cacheService.SetAsync(cacheKey, resultFromDb, 5);

            return Ok(resultFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching clients.");
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    [AuthorizeByUser]
    [HttpGet("GetByCompany")]
    public async Task<IActionResult> GetByCompany()
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("companyId").Value);

            var cacheKey = $"clients:company:{companyId}";
            var cached = await _cacheService.GetAsync<IReadOnlyList<ClientReadDto>>(cacheKey);
            if (cached != null)
            {
                return Ok(cached);
            }

            var clientsFromDb = await _clientService.GetByCompanyAsync(companyId);
            await _cacheService.SetAsync(cacheKey, clientsFromDb);

            return Ok(clientsFromDb);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error while fetching clients for company");
            return StatusCode(500, ex.Message);
        }
    }
}
