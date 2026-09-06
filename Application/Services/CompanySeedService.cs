using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.AppointmentDto;
using Shared.Dtos.ClientDto;
using Shared.Dtos.OrderDto;
using Shared.Dtos.ServiceDto;

namespace Aplication.Services;

public class CompanySeedService
{
    private readonly IClientRepository _clientRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderServiceRepository _orderServiceRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IAppointmentServiceRepository _appointmentServiceRepository;
    private readonly IMapper _mapper;

    public CompanySeedService(
        IClientRepository clientRepository,
        IServiceRepository serviceRepository,
        IOrderRepository orderRepository,
        IOrderServiceRepository orderServiceRepository,
        IAppointmentRepository appointmentRepository,
        IAppointmentServiceRepository appointmentServiceRepository,
        IMapper mapper)
    {
        _clientRepository = clientRepository;
        _serviceRepository = serviceRepository;
        _orderRepository = orderRepository;
        _orderServiceRepository = orderServiceRepository;
        _appointmentRepository = appointmentRepository;
        _appointmentServiceRepository = appointmentServiceRepository;
        _mapper = mapper;
    }

    public async Task SeedForCompanyAsync(Guid companyId)
    {
        var haircut = _mapper.Map<Service>(new ServiceCreateDto { ServiceName = "Haircut", Price = 25m });
        haircut.UpdateCId(companyId);
        await _serviceRepository.AddAsync(haircut);

        var manicure = _mapper.Map<Service>(new ServiceCreateDto { ServiceName = "Manicure", Price = 18m });
        manicure.UpdateCId(companyId);
        await _serviceRepository.AddAsync(manicure);

        var clientOne = _mapper.Map<Client>(new ClientCreateDto
        {
            Name = "Anna Petrova",
            Phone = "+7 900 000-00-01",
            Email = "anna@example.com"
        });
        clientOne.UpdateCId(companyId);
        await _clientRepository.AddAsync(clientOne);

        var clientTwo = _mapper.Map<Client>(new ClientCreateDto
        {
            Name = "Ivan Sidorov",
            Phone = "+7 900 000-00-02",
            Email = "ivan@example.com"
        });
        clientTwo.UpdateCId(companyId);
        await _clientRepository.AddAsync(clientTwo);

        var order = _mapper.Map<Order>(new OrderCreateDto
        {
            Description = "Sample order",
            ClientId = clientOne.Id
        });
        order.UpdateCId(companyId);
        await _orderRepository.AddAsync(order);

        var orderService = new OrderService(order.Id, haircut.Id, 1, haircut.Price);
        await _orderServiceRepository.AddAsync(orderService);

        var appointment = _mapper.Map<Appointment>(new AppointmentCreateDto
        {
            ClientId = clientTwo.Id,
            DateTime = DateTime.UtcNow.AddDays(1),
            Comment = "Sample appointment"
        });
        appointment.UpdateCId(companyId);
        await _appointmentRepository.AddAsync(appointment);

        var appointmentService = new Domain.Entities.AppointmentService(appointment.Id, manicure.Id, 1, manicure.Price);
        await _appointmentServiceRepository.AddAsync(appointmentService);
    }
}