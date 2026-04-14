namespace FactoryApi.Infrastructure.CameraRuntime
{
    public interface ICameraRuntimeReader
    {
        int GetCameraCount();
        CameraSessionState? GetDebugState(int  cameraId);


    }
}
