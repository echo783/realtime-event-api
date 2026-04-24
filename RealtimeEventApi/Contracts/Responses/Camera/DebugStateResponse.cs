namespace RealtimeEventApi.Contracts.Responses.Camera
{
    public class DebugStateResponse
    {
        public bool RotationActive { get; set; }
        public bool LabelInZone { get; set; }
        public bool CountedInCurrentRotation { get; set; }

        public double LastRotationChangeValue { get; set; }
        public double LastMotionRatio { get; set; }
        public double LastLabelChangeValue { get; set; }

        public bool LastStarted { get; set; }
        public bool LastEnded { get; set; }
        public bool LastLabelEnter { get; set; }

        public bool LastDetectorFound { get; set; }
        public float LastDetectorConfidence { get; set; }

        public int LabelDetectedStreak { get; set; }
        public int LabelOffStreak { get; set; }

        public int ProductionCount { get; set; }

        public DateTime LastFrameAt { get; set; }
        public DateTime LastSuccessfulReadAt { get; set; }
        public DateTime LastReconnectAt { get; set; }
        public DateTime SessionStartedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public string LastErrorMessage { get; set; } = string.Empty;
        public DateTime LastErrorAt { get; set; }

        public int ConsecutiveReadFails { get; set; }
        public int ConsecutiveSameFrameCount { get; set; }

        public bool StreamJustReconnected { get; set; }
        public int RotationDetectedStreak { get; set; }
        public int RotationOffStreak { get; set; }

    }
}
