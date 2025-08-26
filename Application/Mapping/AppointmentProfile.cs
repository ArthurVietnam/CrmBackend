using Domain.Entities;
using AutoMapper;
using Shared.Dtos.AppointmentDto;
using Shared.Enums;

namespace Aplication.Mapping;

public class AppointmentProfile : Profile
{
    public AppointmentProfile()
    {
        CreateMap<AppointmentCreateDto, Appointment>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => StatusOfWork.Sheduled))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(_ => DateTime.UtcNow));
        
        CreateMap<Appointment, AppointmentReadDto>();

        CreateMap<AppointmentUpdateDto, Appointment>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}