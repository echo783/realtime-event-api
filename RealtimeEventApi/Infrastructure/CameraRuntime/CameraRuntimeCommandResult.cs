namespace RealtimeEventApi.Infrastructure.CameraRuntime
{
    public sealed class CameraRuntimeCommandResult
    {
        public bool Success { get; init; }
        public string ErrorMessage { get; init; } = string.Empty;
        public DateTime? LastErrorAt { get; init; }

        public static CameraRuntimeCommandResult Ok()
        {
            return new CameraRuntimeCommandResult { Success = true };
        }

        public static CameraRuntimeCommandResult Fail(string errorMessage, DateTime? lastErrorAt = null)
        {
            return new CameraRuntimeCommandResult
            {
                Success = false,
                ErrorMessage = errorMessage,
                LastErrorAt = lastErrorAt
            };
        }
    }
}
