namespace RealtimeEventApi.Contracts.Responses.Camera
{
    public class CameraDetailResponse
    {
        public int CameraId { get; set; }
        public string CameraName { get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string RtspUrl { get; set; } = string.Empty;
    }
}
