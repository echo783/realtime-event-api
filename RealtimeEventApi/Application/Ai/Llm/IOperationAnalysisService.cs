using RealtimeEventApi.Contracts.Requests.Ai.Llm;
using RealtimeEventApi.Contracts.Responses.Ai.Llm;

namespace RealtimeEventApi.Application.Ai.Llm
{
    public interface IOperationAnalysisService
    {
        Task<AnalyzeOperationsResponse> AnalyzeAsync(
            AnalyzeOperationsRequest request,
            CancellationToken ct);
    }
}