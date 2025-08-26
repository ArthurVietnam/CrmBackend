using Domain.Entities;
using AutoMapper;
using Shared.Dtos.OrderDto;

namespace Aplication.Mapping;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<OrderCreateDto, Order>()
            .ForMember(dest => dest.ClientId, opt => opt.Ignore()) 
            .ForMember(dest => dest.Date, opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<Order, OrderReadDto>();

        CreateMap<OrderUpdateDto, Order>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}