using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.AppointmentServiceDto;

namespace Aplication.Services;

public class AppointmentServiceService
{
    private readonly IAppointmentServiceRepository _repository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IMapper _mapper;

    public AppointmentServiceService(
        IAppointmentServiceRepository repository,
        IServiceRepository serviceRepository,
        IMapper mapper)
    {
        _repository = repository;
        _serviceRepository = serviceRepository;
        _mapper = mapper;
    }

    public async Task<AppointmentServiceReadDto> CreateAsync(AppointmentServiceCreateDto dto)
    {
        var service = await _serviceRepository.GetByIdAsync(dto.ServiceId)
                      ?? throw new NotFoundException("Service not found");

        var entity = new Domain.Entities.AppointmentService(
            dto.AppointmentId,
            dto.ServiceId,
            dto.Count,
            service.Price
        );

        await _repository.AddAsync(entity);
        return _mapper.Map<AppointmentServiceReadDto>(entity);
    }

    public async Task<AppointmentServiceReadDto> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Appointment service not found");
        return _mapper.Map<AppointmentServiceReadDto>(entity);
    }

    public async Task<IReadOnlyList<AppointmentServiceReadDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<AppointmentServiceReadDto>>(entities);
    }

    public async Task<IReadOnlyList<AppointmentServiceReadDto>> GetByAppointmentAsync(Guid appointmentId)
    {
        var entities = await _repository.GetByAppointmentAsync(appointmentId);
        return _mapper.Map<IReadOnlyList<AppointmentServiceReadDto>>(entities);
    }

    public async Task<IReadOnlyList<AppointmentServiceReadDto>> GetByServiceAsync(Guid serviceId)
    {
        var entities = await _repository.GetByServiceAsync(serviceId);
        return _mapper.Map<IReadOnlyList<AppointmentServiceReadDto>>(entities);
    }

    public async Task UpdateAsync(AppointmentServiceUpdateDto dto, Guid id)
    {
        var entity = await _repository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Appointment service not found");

        _mapper.Map(dto, entity);
        await _repository.UpdateAsync(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Appointment service not found");
        await _repository.DeleteAsync(entity);
    }

    public async Task<decimal> CalculateAppointmentTotalAsync(Guid appointmentId)
    {
        var services = await _repository.GetByAppointmentAsync(appointmentId);
        return services.Sum(s => s.TotalPrice);
    }

    public async Task<decimal> CalculateTotalRevenueForServiceAsync(Guid serviceId)
    {
        return await _repository.GetTotalRevenueForServiceAsync(serviceId);
    }
}
