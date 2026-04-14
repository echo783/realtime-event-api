using FactoryApi.Contracts.Responses.Camera;
using FactoryApi.Infrastructure.Persistence;
using FactoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FactoryApi.Application.Camera
{
    public class CameraQueryService
    {
        private readonly FactoryDbContext _context;

        public CameraQueryService(FactoryDbContext context)
        {
            _context = context;
        }

        private static CameraListResponse ToListResponse(CameraConfig c)
        {
            return new CameraListResponse
            {
                CameraId = c.CameraId,
                CameraName = c.CameraName,
                Enabled = c.Enabled,
                ProductName = c.ProductName
            };

        }
        public async Task<List<CameraListResponse>> GetListAsync() 
        {
            var cameras = await _context.CameraConfigs.OrderBy(x => x.CameraId).ToListAsync();
            return cameras.Select(c => ToListResponse(c)).ToList();
        }

        public async Task<List<CameraListResponse>> GetEnabledListAsync()
        {
            var cameras = await _context.CameraConfigs.Where(c => c.Enabled).ToListAsync();

            return cameras.Select(ToListResponse).ToList();
        }

        public async Task<CameraDetailResponse?> GetByIdAsync(int id)
        {
            var camera = await _context.CameraConfigs
               .FirstOrDefaultAsync(x => x.CameraId == id);

            if (camera == null)
                return null;

            return new CameraDetailResponse
            {
                CameraId = camera.CameraId, 
                CameraName = camera.CameraName, 
                Enabled = camera.Enabled,
                ProductName= camera.ProductName,
                RtspUrl = camera.RtspUrl
            };
        }


    }
}
