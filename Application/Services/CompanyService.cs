using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.CompanyDto;
using Shared.Enums;

namespace Aplication.Services;

public class CompanyService
{
    private readonly ICompanyRepository _repository;
    private readonly IMapper _mapper;
    private readonly VerificationService _verificationService;

    public CompanyService(ICompanyRepository repository, IMapper mapper,VerificationService verificationService)
    {
        _repository = repository;
        _mapper = mapper;
        _verificationService = verificationService;
    }

    public async Task<CompanyReadDto> CreateAsync(CompanyCreateDto dto)
    {
        var entity = _mapper.Map<Company>(dto);
        await _repository.AddAsync(entity);
        await _verificationService.ResendCodeAsync(entity.Id);
        return _mapper.Map<CompanyReadDto>(entity);
    }

    public async Task<CompanyReadDto> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Company not found");
        return _mapper.Map<CompanyReadDto>(entity);
    }

    public async Task<CompanyReadDto> GetByEmailAsync(string email)
    {
        var entity = await _repository.GetByEmailAsync(email)
                     ?? throw new NotFoundException("Company not found by email");
        return _mapper.Map<CompanyReadDto>(entity);
    }

    public async Task<IReadOnlyList<Company>> GetAllAsync()
    {
        
        return await _repository.GetAllAsync();
    }

    public async Task<IReadOnlyList<CompanyReadDto>> GetActiveCompaniesAsync()
    {
        var entities = await _repository.GetActiveCompaniesAsync();
        return _mapper.Map<IReadOnlyList<CompanyReadDto>>(entities);
    }

    public async Task<IReadOnlyList<CompanyReadDto>> GetExpiredSubscriptionsAsync()
    {
        var entities = await _repository.GetExpiredSubscriptionsAsync();
        return _mapper.Map<IReadOnlyList<CompanyReadDto>>(entities);
    }

    public async Task ExtendSubscriptionAsync(Guid companyId, int months,Subscribes subscribe = Subscribes.Basic)
    {
        var company = await _repository.GetByIdAsync(companyId)
                      ?? throw new NotFoundException("Company not found");

        company.ExtendSubscriptionByMonths(months,subscribe);
        await _repository.UpdateAsync(company);
    }

    public async Task DeactivateCompanyAsync(Guid companyId)
    {
        var result = await _repository.DeactivateCompanyAsync(companyId);
        if (!result) throw new Exception("Deactivation failed");
    }

    public async Task UpdateAsync(CompanyUpdateDto dto,Guid companyId)
    {
        var company = await _repository.GetByIdAsync(companyId)
                      ?? throw new NotFoundException("Company not found");

        _mapper.Map(dto, company);
        await _repository.UpdateAsync(company);
    }

    public async Task DeleteAsync(Guid id)
    {
        var company = await _repository.GetByIdAsync(id)
                      ?? throw new NotFoundException("Company not found");
        await _repository.DeleteAsync(company);
    }

    public async Task<Company> LoginAsync(string email,string password)
    {
        var company = await _repository.GetByEmailAsync(email)
                      ?? throw new NotFoundException("Company not found");
        
        if (!company.IsActive)
            throw new Exception("Out of subscribe");
        
        if (company.Password == password)
        {
            return company;
        }

        throw new UnauthorizedAccessException("Password is not correct");
    }
}
