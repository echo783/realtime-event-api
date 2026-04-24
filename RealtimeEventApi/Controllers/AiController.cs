using Microsoft.AspNetCore.Mvc;
using RealtimeEventApi.Application.Ai.Llm;
using RealtimeEventApi.Contracts.Requests.Ai.Llm;

namespace RealtimeEventApi.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly IOperationAnalysisService _service;

        public AiController(IOperationAnalysisService service)
        {
            _service = service;
        }

        [HttpPost("analyze-operations")]
        public async Task<IActionResult> Analyze(
            [FromBody] AnalyzeOperationsRequest request,
            CancellationToken ct)
        {
            var result = await _service.AnalyzeAsync(request, ct);
            return Ok(result);
        }
    }
}