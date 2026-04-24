using RealtimeEventApi.Contracts.Requests.Camera;
using RealtimeEventApi.Contracts.Responses.Camera;
using RealtimeEventApi.Infrastructure.CameraRuntime;
using RealtimeEventApi.Infrastructure.Persistence;
using RealtimeEventApi.Models;
using Microsoft.EntityFrameworkCore;
using RealtimeEventApi.Application.Camera.Dtos;

namespace RealtimeEventApi.Application.Camera
{
    public class CameraCommandService
    {
        private readonly FactoryDbContext _context;
        private readonly ICameraRuntimeController _cameraRuntimeController;

        public CameraCommandService(
            FactoryDbContext context,
            ICameraRuntimeController cameraRuntimeController)
        {
            _context = context;
            _cameraRuntimeController = cameraRuntimeController;
        }

        public async Task<AddCameraResult> AddCameraAsync(AddCameraRequest request)
        {
            if (request == null)
            {
                return new AddCameraResult { Success = false };
            }

            var camera = new CameraConfig();
            camera.CameraName = request.CameraName;
            camera.RtspUrl = request.RtspUrl;
            camera.Enabled = request.Enabled;
            camera.ProductName = request.ProductName;
            camera.CreatedAt = DateTime.Now;

            _context.CameraConfigs.Add(camera);
            await _context.SaveChangesAsync();

            return new AddCameraResult
            {
                Success = true,
                CameraId = camera.CameraId
            };
        }

        public async Task<DeleteCameraResult> DeleteCameraAsync(int cameraId, CancellationToken token)
        {
            var camera = await _context.CameraConfigs
                .FirstOrDefaultAsync(x => x.CameraId == cameraId, token);

            if (camera == null)
            {
                return new DeleteCameraResult
                {
                    Success = false
                };
            }

            var stopped = await _cameraRuntimeController.StopCameraAsync(cameraId, token);
            if (!stopped)
            {
                return new DeleteCameraResult
                {
                    Success = false,
                    CameraId = cameraId
                };
            }

            _context.CameraConfigs.Remove(camera);
            await _context.SaveChangesAsync(token);

            return new DeleteCameraResult
            {
                Success = true,
                CameraId = cameraId
            };
        }
    }
}
