using OpenCvSharp;

namespace FactoryApi.Infrastructure.CameraRuntime
{
    public interface ILabelDetector
    {
        DetectedLabelResult Detect(Mat labelRoi);
    }
}