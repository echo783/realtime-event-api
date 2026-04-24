namespace RealtimeEventApi.Application.Ai.Llm
{
    public interface ILlmClient
    {
        Task<string> GenerateAsync(string prompt, CancellationToken ct);
    }
}