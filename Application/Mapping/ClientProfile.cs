using Domain.Entities;
using AutoMapper;
using Shared.Dtos.ClientDto;

namespace Aplication.Mapping;

public class ClientProfile : Profile
{
    public ClientProfile()
    {
        CreateMap<ClientCreateDto, Client>();

        CreateMap<Client, ClientReadDto>();

        CreateMap<ClientUpdateDto, Client>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}