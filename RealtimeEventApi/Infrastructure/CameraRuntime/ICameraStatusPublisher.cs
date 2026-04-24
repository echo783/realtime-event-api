using RealtimeEventApi.Contracts.Responses.Camera;

namespace RealtimeEventApi.Infrastructure.CameraRuntime
{
    public interface ICameraStatusPublisher
    {
        Task PublishAsync(CameraRunStatusResponse status, CancellationToken token = default);
    }
}
