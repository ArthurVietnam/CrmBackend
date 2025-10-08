using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.AppointmentDto;
using Shared.Enums;

namespace Aplication.Services;

public class AppointmentService
{
    private readonly IAppointmentRepository _repository;
    private readonly IMapper _mapper;

    public AppointmentService(IAppointmentRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<AppointmentReadDto> CreateAsync(AppointmentCreateDto dto,Guid companyId)
    {
        var entity = _mapper.Map<Appointment>(dto);
        entity.CompanyId = companyId;
        await _repository.AddAsync(entity);
        return _mapper.Map<AppointmentReadDto>(entity);
    }

    public async Task<IReadOnlyList<AppointmentReadDto>> GetByCompany(Guid companyId)
    {
        var entities = await _repository.GetByCompanyAsync(companyId);
        return _mapper.Map<IReadOnlyList<AppointmentReadDto>>(entities);
    }
    public async Task<AppointmentReadDto> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Appointment not found");
        return _mapper.Map<AppointmentReadDto>(entity);
    }

    public async Task<IReadOnlyList<AppointmentReadDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<AppointmentReadDto>>(entities);
    }

    public async Task UpdateAsync(AppointmentUpdateDto dto,Guid companyId,Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Appointment not found");
        if (entity.CompanyId != companyId)
        {
            throw new NotFoundException("Appointment not found");
        }

        _mapper.Map(dto, entity);
        entity.CompanyId = companyId;
        await _repository.UpdateAsync(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Appointment not found");
        await _repository.DeleteAsync(entity);
    }

    public async Task CompleteAppointmentAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id) 
                     ?? throw new NotFoundException("Appointment not found");
        entity.Complete();
        await _repository.UpdateAsync(entity);
    }

    public async Task<IReadOnlyList<AppointmentReadDto>> GetByDateAsync(DateTime date,Guid companyId)
    {
        var entities = await _repository.GetByDateAsync(date,companyId);
        return _mapper.Map<IReadOnlyList<AppointmentReadDto>>(entities);
    }

    public async Task<IReadOnlyList<AppointmentReadDto>> GetByStatusAsync(StatusOfWork status,Guid companyId)
    {
        var entities = await _repository.GetByStatusAsync(status,companyId);
        return _mapper.Map<IReadOnlyList<AppointmentReadDto>>(entities);
    }

    public async Task<IReadOnlyList<AppointmentReadDto>> GetByClientAsync(Guid clientId)
    {
        var entities = await _repository.GetByClientAsync(clientId);
        return _mapper.Map<IReadOnlyList<AppointmentReadDto>>(entities);
    }

    public async Task<IReadOnlyList<AppointmentReadDto>> GetByServiceAsync(Guid serviceId)
    {
        var entities = await _repository.GetByServiceAsync(serviceId);
        return _mapper.Map<IReadOnlyList<AppointmentReadDto>>(entities);
    }
}