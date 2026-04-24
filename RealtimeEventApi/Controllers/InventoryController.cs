using Dapper;
using Microsoft.AspNetCore.Mvc;
using RealtimeEventApi.Infrastructure.Persistence;

namespace RealtimeEventApi.Controllers
{
    [ApiController]
    [Route("api/inventory")]
    public class InventoryController : ControllerBase
    {
        private readonly SqlConnectionFactory _factory;

        public InventoryController(SqlConnectionFactory factory)
        {
            _factory = factory;
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            using var conn = _factory.CreateConnection();

            var sql = @"
SELECT DISTINCT ProductName
FROM dbo.ProductionEvent
WHERE ProductName IS NOT NULL AND ProductName <> ''
ORDER BY ProductName;
";

            var list = await conn.QueryAsync<string>(sql);

            return Ok(list);
        }

        [HttpGet("stock")]
        public async Task<IActionResult> GetStock([FromQuery] string productName)
        {
            if (string.IsNullOrWhiteSpace(productName))
                return BadRequest("productName is required.");

            using var conn = _factory.CreateConnection();

            // ProductionEvent의 DeltaCount 합계를 현재 재고(총 생산량)로 계산
            var sql = @"
SELECT ISNULL(SUM(DeltaCount), 0)
FROM dbo.ProductionEvent
WHERE ProductName = @ProductName;
";

            var stock = await conn.ExecuteScalarAsync<int>(sql, new { ProductName = productName });

            return Ok(new
            {
                productName,
                // remainQuantity의 실제 의미는 ProductionEvent.DeltaCount의 합계(누적 생산량)임
                remainQuantity = stock
            });
        }

    }
}