namespace RealtimeEventApi.Contracts.Requests.Ai.Llm
{
    public class AnalyzeOperationsRequest
    {
        public bool RotationDetected { get; set; }
        public bool LabelDetected { get; set; }
        public List<string>? LabelTexts { get; set; }
        public int ProductionCount { get; set; }
    }
}