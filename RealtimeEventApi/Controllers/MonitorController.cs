using FactoryApi.Application.Monitor;   
using FactoryApi.Contracts.Responses.Monitor;
using Microsoft.AspNetCore.Mvc;

namespace FactoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class MonitorController : ControllerBase
    {
        private readonly MonitorQueryService _monitorQueryService;

        public MonitorController(MonitorQueryService monitorQueryService)
        {
            _monitorQueryService = monitorQueryService;
        }

        [HttpGet("status")]
        public ActionResult<MonitorStatusResponse> GetStatus()
        {
            var dto = _monitorQueryService.GetStatus();
            return Ok(dto);
        }

        [HttpGet("debug/{cameraId:int}")]
        public ActionResult<MonitorDebugResponse> GetDebug(int cameraId)
        {
            var dto = _monitorQueryService.GetDebug(cameraId);
            
            if (dto == null) 
            {
                return NotFound(new
                {
                    message = $"Camera session not found. cameraId={cameraId}"
                });
            }

            return Ok(dto);
        }

        [HttpGet("production/{cameraId:int}")]
        public ActionResult<MonitorProductionResponse> GetProduction(int cameraId)
        {
            var dto = _monitorQueryService.GetProduction(cameraId);
            if (dto == null)
            {
                return NotFound(new
                {
                    message = $"Camera not found. id={cameraId}"
                });
            }

            return Ok(dto);
        }
    }
}