using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Aplication.Interfaces.Repository;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Aplication.Services;

public class JwtService
{
    private readonly IConfiguration _config;
    private readonly IRefreshTokenRepository _refreshTokenRepo;

    public JwtService(IConfiguration config, IRefreshTokenRepository refreshTokenRepo)
    {
        _config = config;
        _refreshTokenRepo = refreshTokenRepo;
    }

    public string GenerateAccessToken(Guid id, string email, string role,Guid companyId)
    {
        
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, id.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim("companyId",companyId.ToString())
        };
        
        var key = _config["JwtSettings:Secret"];
        if (string.IsNullOrEmpty(key) || key.Length < 32) 
        {
            throw new Exception("JWT key must be at least 256 bits (32 bytes) in length.");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GenerateRefreshToken(Guid entityId)
    {
        var existingToken = await _refreshTokenRepo.GetByUserIdAsync(entityId);
        
        if (existingToken != null)
        {
            await _refreshTokenRepo.RemoveAsync(existingToken.Token);
        }

        var refreshToken = new RefreshToken(
            GenerateSecureRefreshToken(),
            DateTime.UtcNow.AddDays(7),
            entityId
        );

        await _refreshTokenRepo.AddAsync(refreshToken);
        return refreshToken.Token;
    }
    
    private string GenerateSecureRefreshToken(int size = 150)
    {
        var randomBytes = new byte[size];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }

        return Convert.ToBase64String(randomBytes); 
    }


    public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
    {
        return await _refreshTokenRepo.GetByTokenAsync(token);
    }

    public async Task RemoveRefreshTokenAsync(string token)
    {
        await _refreshTokenRepo.RemoveAsync(token);
    }
}
