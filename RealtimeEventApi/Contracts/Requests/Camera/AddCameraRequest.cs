using System.ComponentModel.DataAnnotations;

namespace RealtimeEventApi.Contracts.Requests.Camera
{
    public class AddCameraRequest
    {
        [Required(ErrorMessage = "카메라명은 필수입니다.")]
        [MaxLength(100, ErrorMessage = "카메라명은 100자 이하입니다.")]
        public string CameraName { get; set; } = string.Empty;

        public bool Enabled { get; set; }

        [Required(ErrorMessage = "Rtsp Url은 필수입니다.")]
        [MaxLength(500,ErrorMessage ="Rtsp Url은 500자 이하입니다.")]
        public string RtspUrl { get; set; } = string.Empty;

        [Required(ErrorMessage ="품목명은 필수입니다.")]
        [MaxLength(100,ErrorMessage ="품목명은 100자 이하입니다.")]
        public string ProductName { get; set; } = string.Empty;
    }
}
