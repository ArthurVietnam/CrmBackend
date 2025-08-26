using Domain.Entities;
using AutoMapper;
using Shared.Dtos.UserDto;

namespace Aplication.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UserCreateDto, User>();

        CreateMap<User, UserReadDto>();

        CreateMap<UserUpdateDto, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}