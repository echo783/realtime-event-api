namespace RealtimeEventApi.Infrastructure.CameraRuntime
{
    public interface ICameraRuntimeReader
    {
        int GetCameraCount();
        CameraSessionSnapshot? GetDebugState(int  cameraId);


    }
}
