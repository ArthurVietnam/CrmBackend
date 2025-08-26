using Domain.Entities;
using AutoMapper;
using Shared.Dtos.OrderServiceDto;

namespace Aplication.Mapping;

public class OrderServiceProfile : Profile
{
    public OrderServiceProfile()
    {
        CreateMap<OrderServiceCreateDto, OrderService>();

        CreateMap<OrderService, OrderServiceReadDto>();

        CreateMap<OrderServiceUpdateDto, OrderService>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}