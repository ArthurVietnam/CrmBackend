using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using AutoMapper;
using Domain.Entities;
using Shared.Dtos.ClientDto;

namespace Aplication.Services;

public class ClientService
{
    private readonly IClientRepository _repository;
    private readonly IMapper _mapper;

    public ClientService(IClientRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ClientReadDto> CreateAsync(ClientCreateDto dto,Guid companyId)
    {
        var entity = _mapper.Map<Client>(dto);
        entity.CompanyId = companyId;
        await _repository.AddAsync(entity);
        return _mapper.Map<ClientReadDto>(entity);
    }

    public async Task<IReadOnlyList<ClientReadDto>> SearchAsync(string searchTerm,Guid companyId)
    {
        var entities = await _repository.SearchAsync(searchTerm,companyId);
        return _mapper.Map<IReadOnlyList<ClientReadDto>>(entities);
    }

    public async Task<IReadOnlyList<ClientReadDto>> GetByCompanyAsync(Guid companyId)
    {
        var entities = await _repository.GetByCompanyAsync(companyId);
        return _mapper.Map<IReadOnlyList<ClientReadDto>>(entities);
    }

    public async Task<IReadOnlyList<ClientReadDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<ClientReadDto>>(entities);
    }

    public async Task<ClientReadDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Client not found");
        return _mapper.Map<ClientReadDto>(entity);
    }

    public async Task UpdateAsync(ClientUpdateDto dto,Guid companyId,Guid clientId)
    {
        var entity = await _repository.GetByIdAsync(clientId)
                     ?? throw new NotFoundException("Client not found");

        _mapper.Map(dto, entity);
        entity.CompanyId = companyId;
        await _repository.UpdateAsync(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id)
                     ?? throw new NotFoundException("Client not found");
        await _repository.DeleteAsync(entity);
    }
}
