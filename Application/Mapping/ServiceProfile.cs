using Domain.Entities;
using AutoMapper;
using Shared.Dtos.ServiceDto;

namespace Aplication.Mapping;

public class ServiceProfile : Profile
{
    public ServiceProfile()
    {
        CreateMap<ServiceCreateDto, Service>();

        CreateMap<Service, ServiceReadDto>();

        CreateMap<ServiceUpdateDto, Service>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}