namespace RealtimeEventApi.Infrastructure.CameraRuntime
{
    public interface ICameraRuntimeController
    {
        bool IsRunning(int cameraId);
        Task<CameraRuntimeCommandResult> StartCameraAsync(int cameraId, CancellationToken token = default);
        Task<bool> StopCameraAsync(int cameraId, CancellationToken token = default);
        bool RequestAnalysisReset(int cameraId);
    }
}
