using RealtimeEventApi.Contracts.Requests.Ai.Llm;
using RealtimeEventApi.Contracts.Responses.Ai.Llm;

namespace RealtimeEventApi.Application.Ai.Llm
{
    public sealed class OperationAnalysisService : IOperationAnalysisService
    {
        private readonly ILlmClient _llmClient;

        public OperationAnalysisService(ILlmClient llmClient)
        {
            _llmClient = llmClient;
        }

        public async Task<AnalyzeOperationsResponse> AnalyzeAsync(
            AnalyzeOperationsRequest request,
            CancellationToken ct)
        {
            var texts = request.LabelTexts is null
                ? "-"
                : string.Join(", ", request.LabelTexts);

            var prompt = $"""
현재 공정 상태를 분석해 주세요.

- 회전 감지: {request.RotationDetected}
- 라벨 감지: {request.LabelDetected}
- OCR 텍스트: {texts}
- 생산 수량: {request.ProductionCount}

다음 형식으로 한국어로 짧게 작성하세요.
1. 상태 요약
2. 원인 추정
3. 권장 조치
""";

            var summary = await _llmClient.GenerateAsync(prompt, ct);

            return new AnalyzeOperationsResponse
            {
                Summary = summary
            };
        }
    }
}