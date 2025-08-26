using Domain.Entities;
using AutoMapper;
using Shared.Dtos.CompanyDto;
using Shared.Enums;

namespace Aplication.Mapping;

public class CompanyProfile : Profile
{
    public CompanyProfile()
    {
        CreateMap<CompanyCreateDto, Company>()
            .ForMember(dest => dest.Subscribe, opt => opt.MapFrom(_ => Subscribes.Free));
        
        CreateMap<Company, CompanyReadDto>();

        CreateMap<CompanyUpdateDto, Company>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}