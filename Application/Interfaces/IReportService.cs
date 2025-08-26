namespace Aplication.Interfaces;

public interface IReportService
{
    Task<byte[]> GenerateMonthlyReportAsync(Guid companyId, int month, int year);
}