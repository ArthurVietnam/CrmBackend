using Domain.Entities;
using AutoMapper;
using Shared.Dtos.VerificationCodeDto;

namespace Aplication.Mapping;

public class VerificationCodeProfile : Profile
{
    public VerificationCodeProfile()
    {
        CreateMap<VerificationCodeCreateDto, VerificationCode>();

        CreateMap<VerificationCode, VerificationCodeReadDto>();
    }
}