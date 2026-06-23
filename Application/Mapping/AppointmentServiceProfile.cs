using AutoMapper;
using Domain.Entities;
using Shared.Dtos.AppointmentServiceDto;

namespace Aplication.Mapping;

public class AppointmentServiceProfile : Profile
{
    public AppointmentServiceProfile()
    {
        CreateMap<AppointmentServiceCreateDto, AppointmentService>();

        CreateMap<AppointmentService, AppointmentServiceReadDto>();

        CreateMap<AppointmentServiceUpdateDto, AppointmentService>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
