namespace RealtimeEventApi.Contracts.Responses.Monitor
{
    public sealed class MonitorProductionResponse
    {
        public int CameraId { get; set; }
        public int ProductionCount { get; set; }
        public DateTime? LastProductionAt { get; set; }
    }
}
