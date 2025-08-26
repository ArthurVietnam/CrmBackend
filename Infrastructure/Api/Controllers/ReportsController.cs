using Aplication.Attributes.Authorization;
using Aplication.Interfaces;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CrmPridnestrovye.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AuthorizeByUser]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyReport(int month, int year)
    {
        var companyId = Guid.Parse(User.FindFirst("companyId").Value);

        var fileBytes = await _reportService.GenerateMonthlyReportAsync(companyId, month, year);
        var fileName = $"Отчёт_{month:D2}_{year}.xlsx";
        return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
}