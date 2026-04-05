using FactoryApi.Contracts.Responses.Monitor;
using FactoryApi.Infrastructure.CameraRuntime;

namespace FactoryApi.Application.Monitor
{
    public sealed class MonitorQueryService
    {
        private readonly CameraOrchestrator _cameraOrchestrator;

        public MonitorQueryService(CameraOrchestrator cameraOrchestrator)
        {
            _cameraOrchestrator = cameraOrchestrator;
        }

        public MonitorStatusResponse GetStatus()
        {
            return new MonitorStatusResponse
            {
                CameraCount = _cameraOrchestrator.GetCameraCount(),
                WorkStatus = "running",
                ServerTime = DateTime.Now
            };
        }

        public MonitorDebugResponse? GetDebug(int cameraId)
        {
            var state = _cameraOrchestrator.GetDebugState(cameraId);
            if (state == null)
            {
               return null;
            }

            var dto = new MonitorDebugResponse
            {
                RotationActive = state.RotationActive,
                LabelInZone = state.LabelInZone,

                LastStarted = state.LastStarted,
                LastEnded = state.LastEnded,
                LastLabelEnter = state.LastLabelEnter,

                LastRotationChangeValue = state.LastRotationChangeValue,
                LastMotionRatio = state.LastMotionRatio,
                LastLabelChangeValue = state.LastLabelChangeValue,

                ProductionCount = state.ProductionCount,

                LastProductionAt = state.LastProductionAt == DateTime.MinValue
                    ? (DateTime?)null
                    : state.LastProductionAt
            };

            return dto;
        }

        public MonitorProductionResponse? GetProduction(int cameraId)
        {
            var state = _cameraOrchestrator.GetDebugState(cameraId);
            if(state == null)
            {
                return null;
            }
            return new MonitorProductionResponse
            {
                CameraId = cameraId,
                ProductionCount = state.ProductionCount,
                LastProductionAt = state.LastProductionAt == DateTime.MinValue
                    ? (DateTime?)null
                    : state.LastProductionAt
            };
        }

    }
}
