using RealtimeEventApi.Application.Ai.Llm;

namespace RealtimeEventApi.Infrastructure.Ai.Llm
{
    public sealed class FakeLlmClient : ILlmClient
    {
        public Task<string> GenerateAsync(string prompt, CancellationToken ct)
        {
            const string result =
                "현재 라벨 인식은 정상이며, 객체 감지가 간헐적으로 실패할 수 있습니다. " +
                "ROI 위치 또는 조명 상태를 점검하는 것을 권장합니다.";

            return Task.FromResult(result);
        }
    }
}