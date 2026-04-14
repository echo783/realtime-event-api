using System.ComponentModel.DataAnnotations;

namespace FactoryApi.Contracts.Requests.Camera
{
    public class SaveRoiRequest
    {
        [Range(0, int.MaxValue, ErrorMessage = "Object ROI X는 0 이상이어야 합니다.")]
        public int ObjectRoiX { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Object ROI Y는 0 이상이어야 합니다.")]
        public int ObjectRoiY { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Object ROI 너비는 1 이상이어야 합니다.")]
        public int ObjectRoiW { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Object ROI 높이는 1 이상이어야 합니다.")]
        public int ObjectRoiH { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Label ROI X는 0 이상이어야 합니다.")]
        public int LabelRoiX { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Label ROI Y는 0 이상이어야 합니다.")]
        public int LabelRoiY { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Label ROI 너비는 1 이상이어야 합니다.")]
        public int LabelRoiW { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Label ROI 높이는 1 이상이어야 합니다.")]
        public int LabelRoiH { get; set; }

        public bool CheckRotation { get; set; }
        public bool CheckLabel { get; set; }
    }
}