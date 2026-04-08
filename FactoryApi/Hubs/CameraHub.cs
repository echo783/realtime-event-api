using Microsoft.AspNetCore.SignalR;

namespace FactoryApi.Hubs
{
    public class CameraHub : Hub
    {
        public Task JoinCameraGroup(int cameraId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, $"camera-{cameraId}");
        }

        public Task LeaveCameraGroup(int cameraId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, $"camera-{cameraId}");
        }
    }
}