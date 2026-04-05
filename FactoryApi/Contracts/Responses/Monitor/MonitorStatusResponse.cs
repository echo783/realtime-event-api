namespace FactoryApi.Contracts.Responses.Monitor
{
    public sealed class MonitorStatusResponse
    {
        public int CameraCount { get; set; }
        public string WorkStatus { get; set; } = string.Empty;
        public DateTime ServerTime { get; set; }
    }
}
