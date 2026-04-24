using RealtimeEventApi.Contracts.Responses.Monitor;
using RealtimeEventApi.Infrastructure.CameraRuntime;

namespace RealtimeEventApi.Application.Monitor
{
    public sealed class MonitorQueryService
    {
        private readonly ICameraRuntimeReader _cameraRuntimeReader;
        public MonitorQueryService( ICameraRuntimeReader cameraRuntimeReader)
        {
            _cameraRuntimeReader = cameraRuntimeReader;
        }

        public MonitorStatusResponse GetStatus()
        {
            return new MonitorStatusResponse
            {
                CameraCount = _cameraRuntimeReader.GetCameraCount(),
                WorkStatus = "running",
                ServerTime = DateTime.Now
            };
        }

        public MonitorDebugResponse? GetDebug(int cameraId)
        {
            var state = _cameraRuntimeReader.GetDebugState(cameraId);
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
                    : state.LastProductionAt,
                LastSuccessfulReadAt = state.LastSuccessfulReadAt == DateTime.MinValue
                    ? (DateTime?)null
                    : state.LastSuccessfulReadAt,
                LastErrorAt = state.LastErrorAt == DateTime.MinValue
                    ? (DateTime?)null
                    : state.LastErrorAt,
                LastErrorMessage = state.LastErrorMessage
            };

            return dto;
        }

        public MonitorProductionResponse? GetProduction(int cameraId)
        {
            var state = _cameraRuntimeReader.GetDebugState(cameraId);
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
