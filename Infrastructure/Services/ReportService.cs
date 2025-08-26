using Aplication.Interfaces;
using ClosedXML.Excel;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Shared.Enums;

namespace CrmPridnestrovye.Services;

public class ReportService : IReportService
{
    private readonly ProjectDbContext _context;

    public ReportService(ProjectDbContext context)
    {
        _context = context;
    }

    public async Task<byte[]> GenerateMonthlyReportAsync(Guid companyId, int month, int year)
    {
        var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);  
        var end = start.AddMonths(1);

        var orders = await _context.Orders
            .Include(o => o.Client)
            .Include(o => o.OrderServices).ThenInclude(os => os.Service)
            .Where(o => o.CompanyId == companyId && o.Date >= start && o.Date < end && o.Status == StatusOfWork.Done)
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var sheet = workbook.AddWorksheet("Report");

        sheet.Cell("A1").Value = "Monthly report";
        sheet.Cell("B1").Value = $"{month:D2}.{year}";
        sheet.Cell("A3").Value = "Client";
        sheet.Cell("B3").Value = "Date";
        sheet.Cell("C3").Value = "Service";
        sheet.Cell("D3").Value = "Count";
        sheet.Cell("E3").Value = "Price";
        sheet.Cell("F3").Value = "Sum";

        int row = 4;
        decimal total = 0;

        foreach (var order in orders)
        {
            foreach (var os in order.OrderServices)
            {
                sheet.Cell(row, 1).Value = order.Client?.Name ?? "—";
                sheet.Cell(row, 2).Value = order.Date.ToString("dd.MM.yyyy");
                sheet.Cell(row, 3).Value = os.Service.ServiceName;
                sheet.Cell(row, 4).Value = os.Count;
                sheet.Cell(row, 5).Value = os.Price;
                sheet.Cell(row, 6).Value = os.TotalPrice;

                total += os.TotalPrice;
                row++;
            }
        }

        sheet.Cell(row + 1, 5).Value = "Total:";
        sheet.Cell(row + 1, 6).Value = total;
        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
