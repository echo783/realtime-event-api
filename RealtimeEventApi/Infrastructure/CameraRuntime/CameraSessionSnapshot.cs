namespace RealtimeEventApi.Infrastructure.CameraRuntime
{
    public sealed class CameraSessionSnapshot
    {
        public DateTime LastLatestSavedAt { get; init; }
        public DateTime LastProductionAt { get; init; }
        public DateTime RotationStartTime { get; init; }
        public bool RotationActive { get; init; }
        public bool LabelInZone { get; init; }
        public bool CountedInCurrentRotation { get; init; }
        public double LastRotationChangeValue { get; init; }
        public double LastMotionRatio { get; init; }
        public double LastLabelChangeValue { get; init; }
        public bool LastStarted { get; init; }
        public bool LastEnded { get; init; }
        public bool LastLabelEnter { get; init; }
        public bool LastDetectorFound { get; init; }
        public float LastDetectorConfidence { get; init; }
        public int LabelDetectedStreak { get; init; }
        public int LabelOffStreak { get; init; }
        public int ProductionCount { get; init; }
        public DateTime LastFrameAt { get; init; }
        public DateTime LastSuccessfulReadAt { get; init; }
        public DateTime LastReconnectAt { get; init; }
        public DateTime SessionStartedAt { get; init; }
        public DateTime LastUpdatedAt { get; init; }
        public string LastErrorMessage { get; init; } = string.Empty;
        public DateTime LastErrorAt { get; init; }
        public int ConsecutiveReadFails { get; init; }
        public int ConsecutiveSameFrameCount { get; init; }
        public bool StreamJustReconnected { get; init; }
        public int RotationDetectedStreak { get; init; }
        public int RotationOffStreak { get; init; }
    }
}
