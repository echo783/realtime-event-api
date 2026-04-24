using OpenCvSharp;

namespace RealtimeEventApi.Infrastructure.CameraRuntime
{
    public interface ILabelDetector
    {
        DetectedLabelResult Detect(Mat labelRoi);
    }
}