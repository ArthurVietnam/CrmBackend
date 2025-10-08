using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.OrderDto;
using Shared.Dtos.OrderServiceDto;
using Shared.Enums;

namespace Aplication.Services;

public class OrderServices
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderServiceRepository _orderServiceRepository;
    private readonly IMapper _mapper;

    public OrderServices(
        IOrderRepository orderRepository,
        IOrderServiceRepository orderServiceRepository,
        IMapper mapper)
    {
        _orderRepository = orderRepository;
        _orderServiceRepository = orderServiceRepository;
        _mapper = mapper;
    }

    public async Task<OrderReadDto> CreateOrderAsync(OrderCreateDto dto,Guid companyId)
    {
        var order = _mapper.Map<Order>(dto);
        order.CompanyId = companyId;
        await _orderRepository.AddAsync(order);
        return _mapper.Map<OrderReadDto>(order);
    }

    public async Task AddServiceToOrderAsync(OrderServiceCreateDto dto)
    {
        var orderService = _mapper.Map<OrderService>(dto);
        await _orderServiceRepository.AddAsync(orderService);
    }

    public async Task CompleteOrderAsync(Guid orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId) 
                    ?? throw new NotFoundException("Order not Found");
        
        order.Complete();
        await _orderRepository.UpdateAsync(order);
    }

    public async Task<OrderReadDto?> GetByIdAsync(Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Order not found");
        return _mapper.Map<OrderReadDto>(order);
    }

    public async Task<IReadOnlyList<OrderReadDto>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<OrderReadDto>>(orders);
    }

    public async Task<IReadOnlyList<OrderReadDto>> GetByCompanyAsync(Guid companyId)
    {
        var orders = await _orderRepository.GetByCompanyAsync(companyId);
        return _mapper.Map<IReadOnlyList<OrderReadDto>>(orders);
    }

    public async Task<IReadOnlyList<OrderReadDto>> GetByClientAsync(Guid clientId)
    {
        var orders = await _orderRepository.GetByClientAsync(clientId);
        return _mapper.Map<IReadOnlyList<OrderReadDto>>(orders);
    }

    public async Task<IReadOnlyList<OrderReadDto>> GetByStatusAsync(StatusOfWork status,Guid companyId)
    {
        var orders = await _orderRepository.GetByStatusAsync(status,companyId);
        return _mapper.Map<IReadOnlyList<OrderReadDto>>(orders);
    }

    public async Task<IReadOnlyList<OrderReadDto>> GetByDateRangeAsync(DateTime start, DateTime end,Guid companyId)
    {
        var orders = await _orderRepository.GetOrdersByDateRangeAsync(start, end,companyId);
        return _mapper.Map<IReadOnlyList<OrderReadDto>>(orders);
    }

    public async Task UpdateAsync(OrderUpdateDto dto,Guid companyId,Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Order not found");

        _mapper.Map(dto, order);
        order.CompanyId = companyId;
        await _orderRepository.UpdateAsync(order);
    }

    public async Task DeleteAsync(Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Order not found");
        await _orderRepository.DeleteAsync(order);
    }
}
