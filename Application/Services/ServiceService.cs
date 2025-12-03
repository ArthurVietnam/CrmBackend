using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.ServiceDto;

namespace Aplication.Services;

public class ServiceService
{
    private readonly IServiceRepository _repository;
    private readonly IMapper _mapper;

    public ServiceService(IServiceRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ServiceReadDto> CreateAsync(ServiceCreateDto dto,Guid companyId)
    {
        var entity = _mapper.Map<Service>(dto);
        entity.UpdateCId(companyId);
        await _repository.AddAsync(entity);
        return _mapper.Map<ServiceReadDto>(entity);
    }

    public async Task<ServiceReadDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Service not found");
        return _mapper.Map<ServiceReadDto>(entity);
    }

    public async Task UpdateAsync(ServiceUpdateDto dto,Guid companyId)
    {
        var entity = await _repository.GetByIdAsync(dto.Id) 
                     ?? throw new NotFoundException("Service not found");
        
        _mapper.Map(dto, entity);
        entity.UpdateCId(companyId);
        await _repository.UpdateAsync(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Service not found");
        await _repository.DeleteAsync(entity);
    }

    public async Task<IReadOnlyList<ServiceReadDto>> GetPopularServicesAsync(Guid companyId,int count = 5)
    {
        var entities = await _repository.GetPopularServicesAsync(count,companyId);
        return _mapper.Map<IReadOnlyList<ServiceReadDto>>(entities);
    }

    public async Task<IReadOnlyList<ServiceReadDto>> SearchAsync(string searchTerm,Guid companyId)
    {
        var entities = await _repository.SearchAsync(searchTerm,companyId);
        return _mapper.Map<IReadOnlyList<ServiceReadDto>>(entities);
    }

    public async Task<IReadOnlyList<ServiceReadDto>> GetByCompanyAsync(Guid companyId)
    {
        var services = await _repository.GetByCompanyAsync(companyId);
        return _mapper.Map<IReadOnlyList<ServiceReadDto>>(services);
    }

    public async Task<IReadOnlyList<ServiceReadDto>> GetServicesByDateRangeAsync(DateTime start, DateTime end,Guid companyId)
    {
        var services = await _repository.GetAllAsync();
        var filteredServices = services
            .Where(s => s.Appointments.Any(a => a.Date >= start && a.Date <= end && a.CompanyId == companyId))
            .ToList();
        
        return _mapper.Map<IReadOnlyList<ServiceReadDto>>(filteredServices);
    }
}
