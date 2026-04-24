using RealtimeEventApi.Contracts.Responses.Camera;
using RealtimeEventApi.Infrastructure.CameraRuntime;
using RealtimeEventApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using RealtimeEventApi.Application.Camera.Dtos;

namespace RealtimeEventApi.Application.Camera
{
    public class CameraDebugService
    {
        private readonly ICameraRuntimeReader _cameraRuntimeReader;
        private readonly FactoryDbContext _context;

        public CameraDebugService(ICameraRuntimeReader cameraRuntimeReader,  FactoryDbContext context)
        {
            _cameraRuntimeReader = cameraRuntimeReader;
            _context = context;
        }

        public DebugStateResponse? GetDebugState(int cameraId)
        {
            var state = _cameraRuntimeReader.GetDebugState(cameraId);
            if (state == null) {
                return null;
            }

            return new DebugStateResponse
            {
                RotationActive = state.RotationActive,
                LabelInZone = state.LabelInZone,
                CountedInCurrentRotation = state.CountedInCurrentRotation,
                LastRotationChangeValue = state.LastRotationChangeValue,
                LastMotionRatio = state.LastMotionRatio,
                LastLabelChangeValue = state.LastLabelChangeValue,
                LastStarted = state.LastStarted,
                LastEnded = state.LastEnded,
                LastLabelEnter = state.LastLabelEnter,
                LastDetectorFound = state.LastDetectorFound,
                LastDetectorConfidence = state.LastDetectorConfidence,
                LabelDetectedStreak = state.LabelDetectedStreak,
                LabelOffStreak = state.LabelOffStreak,
                ProductionCount = state.ProductionCount,
                LastFrameAt = state.LastFrameAt,
                LastSuccessfulReadAt = state.LastSuccessfulReadAt,
                LastReconnectAt = state.LastReconnectAt,
                SessionStartedAt = state.SessionStartedAt,
                LastUpdatedAt = state.LastUpdatedAt,
                LastErrorMessage = state.LastErrorMessage,
                LastErrorAt = state.LastErrorAt,
                ConsecutiveReadFails = state.ConsecutiveReadFails,
                ConsecutiveSameFrameCount = state.ConsecutiveSameFrameCount,
                StreamJustReconnected = state.StreamJustReconnected,
                RotationDetectedStreak = state.RotationDetectedStreak,
                RotationOffStreak = state.RotationOffStreak
            };
        }

        public async Task<CameraDebugConfigResult?> GetDebugConfigAsync(int cameraId, CancellationToken token) 
        {
            var cam = await _context.CameraConfigs
              .AsNoTracking()
              .FirstOrDefaultAsync(x => x.CameraId == cameraId, token);

            if (cam == null)
                return null;

            var cameraDebugConfigResult = new CameraDebugConfigResult();

            cameraDebugConfigResult.CameraId = cam.CameraId;
            cameraDebugConfigResult.CameraName = cam.CameraName;
            cameraDebugConfigResult.ProductName= cam.ProductName;
            cameraDebugConfigResult.CheckRotation= cam.CheckRotation;
            cameraDebugConfigResult.CheckLabel  = cam.CheckLabel;

            cameraDebugConfigResult.ObjectRoiX = cam.ObjectRoiX;
            cameraDebugConfigResult.ObjectRoiY= cam.ObjectRoiY;    
            cameraDebugConfigResult.ObjectRoiW = cam.ObjectRoiW;    
            cameraDebugConfigResult.ObjectRoiH  = cam.ObjectRoiH;   

            cameraDebugConfigResult.LabelRoiX = cam.LabelRoiX;  
            cameraDebugConfigResult.LabelRoiY = cam.LabelRoiY;
            cameraDebugConfigResult.LabelRoiW = cam.LabelRoiW;
            cameraDebugConfigResult.LabelRoiH = cam.LabelRoiH;

            cameraDebugConfigResult.LatestUrl = $"/api/Camera/{cameraId}/image?t={DateTimeOffset.Now.ToUnixTimeMilliseconds()}";

            return cameraDebugConfigResult;

        }

    }
}
