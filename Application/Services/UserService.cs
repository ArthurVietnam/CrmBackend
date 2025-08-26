using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.UserDto;
using Shared.Enums;

namespace Aplication.Services;

public class UserService
{
    private readonly IUserRepository _repository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository repository,ICompanyRepository companyRepository , IMapper mapper)
    {
        _repository = repository;
        _companyRepository = companyRepository;
        _mapper = mapper;
    }
    

    public async Task<UserReadDto> CreateAsync(UserCreateDto dto,Guid companyId)
    {
        var users = await _repository.GetByCompanyAsync(companyId);
        var company = await _companyRepository.GetByIdAsync(companyId)
                      ?? throw new NotFoundException("Company Not Found");
        
        if (company.Subscribe != Subscribes.Pro && users.Count >= 5)
        {
            throw new Exception("Out of user limit");
        }
            
        if (!await _repository.IsEmailUniqueAsync(dto.Email,companyId))
            throw new Exception("Email already registered");

        var entity = _mapper.Map<User>(dto);
        entity.CompanyId = companyId;
        await _repository.AddAsync(entity);
        return _mapper.Map<UserReadDto>(entity);
    }

    public async Task<UserReadDto> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
            ?? throw new NotFoundException("User not found");
        return _mapper.Map<UserReadDto>(entity);
    }

    public async Task UpdateAsync(UserUpdateDto dto,Guid companyId)
    {
        var entity = await _repository.GetByIdAsync(dto.Id) 
            ?? throw new NotFoundException("User not found");

        if (!string.IsNullOrEmpty(dto.Email) && 
            await _repository.IsEmailUniqueAsync(dto.Email,companyId))
        {
            throw new Exception("Email already registered");
        }

        _mapper.Map(dto, entity);
        entity.CompanyId = companyId;
        await _repository.UpdateAsync(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
            ?? throw new NotFoundException("User not found");
        await _repository.DeleteAsync(entity);
    }

    public async Task<IReadOnlyList<UserReadDto>> GetByCompanyAsync(Guid companyId)
    {
        var entities = await _repository.GetByCompanyAsync(companyId);
        return _mapper.Map<IReadOnlyList<UserReadDto>>(entities);
    }

    public async Task UpdatePasswordAsync(Guid userId, string newPassword)
    {
        var entity = await _repository.GetByIdAsync(userId) 
            ?? throw new NotFoundException("User not found");
        
        entity.Password = newPassword;
        await _repository.UpdateAsync(entity);
    }
    
    public async Task<UserReadDto> ValidateUserAsync(string email, string password)
    {
        var user = await _repository.GetByEmailAsync(email)
                   ?? throw new NotFoundException("User not found");
        
        if (!await _companyRepository.IsSubscriptionActiveAsync(user.CompanyId))
            throw new Exception("Out of subscribe");
        
        if (user.Password == password)
            return _mapper.Map<UserReadDto>(user);
        
        throw new UnauthorizedAccessException("Password is not correct");
    }

    public async Task<Guid> GetCompanyIdByEmail(string email)
    {
        return await _repository.GetIdByEmail(email);
    }

}