using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.OrderServiceDto;

namespace Aplication.Services;

public class OrderServiceService
{
    private readonly IOrderServiceRepository _repository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IMapper _mapper;

    public OrderServiceService(IOrderServiceRepository repository ,IServiceRepository serviceRepository ,IMapper mapper)
    {
        _repository = repository;
        _serviceRepository = serviceRepository;
        _mapper = mapper;
    }

    public async Task<OrderServiceReadDto> CreateAsync(OrderServiceCreateDto dto)
    {
        var service = await _serviceRepository.GetByIdAsync(dto.ServiceId)
                      ?? throw new NotFoundException("Service not found");

        var entity = new OrderService(
            dto.OrderId,
            dto.ServiceId,
            dto.Count,
            service.Price 
        );
        
        await _repository.AddAsync(entity);
        return _mapper.Map<OrderServiceReadDto>(entity);
    }

    public async Task<OrderServiceReadDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Order service not found");
        return _mapper.Map<OrderServiceReadDto>(entity);
    }

    public async Task<IReadOnlyList<OrderServiceReadDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<OrderServiceReadDto>>(entities);
    }

    public async Task<IReadOnlyList<OrderServiceReadDto>> GetByOrderAsync(Guid orderId)
    {
        var entities = await _repository.GetByOrderAsync(orderId);
        return _mapper.Map<IReadOnlyList<OrderServiceReadDto>>(entities);
    }

    public async Task<IReadOnlyList<OrderServiceReadDto>> GetByServiceAsync(Guid serviceId)
    {
        var entities = await _repository.GetByServiceAsync(serviceId);
        return _mapper.Map<IReadOnlyList<OrderServiceReadDto>>(entities);
    }

    public async Task UpdateAsync(OrderServiceUpdateDto dto,Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Order service not found");

        _mapper.Map(dto, entity);
        await _repository.UpdateAsync(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Order service not found");
        await _repository.DeleteAsync(entity);
    }

    public async Task<decimal> CalculateOrderTotalAsync(Guid orderId)
    {
        var services = await _repository.GetByOrderAsync(orderId);
        return services.Sum(s => s.TotalPrice);
    }

    public async Task<decimal> CalculateTotalRevenueForServiceAsync(Guid serviceId)
    {
        return await _repository.GetTotalRevenueForServiceAsync(serviceId);
    }
}
