(function() {
    const cameraSelect = document.getElementById("cameraSelect");
    const startAt = document.getElementById("startAt");
    const endAt = document.getElementById("endAt");
    const btnQuery = document.getElementById("btnQuery");
    const btnReset = document.getElementById("btnReset");
    const resultCount = document.getElementById("resultCount");
    const loading = document.getElementById("loading");
    const eventsTableBody = document.getElementById("eventsTableBody");

    // 요약 정보 엘리먼트
    const totalQtyEl = document.getElementById("totalQty");
    const totalEventsEl = document.getElementById("totalEvents");
    const avgQtyEl = document.getElementById("avgQty");
    const peakHourEl = document.getElementById("peakHour");
    const compareValueEl = document.getElementById("compareValue");

    let historyChartInstance = null;

    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        bindEvents();
        setTodayRange();
        await loadCameraOptions();
        await fetchHistory();
    }

    function bindEvents() {
        btnQuery?.addEventListener("click", fetchHistory);
        btnReset?.addEventListener("click", async () => {
            if (cameraSelect) cameraSelect.value = "";
            setTodayRange();
            await fetchHistory();
        });
    }

    function setTodayRange() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const today = `${yyyy}-${mm}-${dd}`;

        if (startAt) startAt.value = today;
        if (endAt) endAt.value = today;
    }

    async function loadCameraOptions() {
        if (!cameraSelect) return;
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("/api/camera/list", {
                headers: { "Authorization": token ? `Bearer ${token}` : "" }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const cameras = await response.json();
            cameraSelect.innerHTML = `<option value="">모두</option>`;
            cameras.forEach((cam) => {
                const opt = document.createElement("option");
                opt.value = String(cam.cameraId);
                opt.textContent = cam.cameraName;
                cameraSelect.appendChild(opt);
            });
        } catch (error) {
            console.error("카메라 목록 로드 실패:", error);
        }
    }

    async function fetchHistory() {
        setLoading(true);
        try {
            const query = buildQueryString();
            const response = await fetch(`/api/history/events?${query}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            // 백엔드에서 DB에 저장된 DeltaCount를 포함한 데이터를 받음
            const items = await response.json();
            const data = Array.isArray(items) ? items : [];
            
            renderRows(data);
            renderChart(data);
            updateSummary(data);
            
            if (isSearchingToday()) {
                await fetchComparison(data);
            } else {
                compareValueEl.textContent = "N/A";
                compareValueEl.className = "value";
            }
        } catch (error) {
            console.error("이력 조회 실패:", error);
            renderError("조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    function isSearchingToday() {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        return startAt.value === todayStr && endAt.value === todayStr;
    }

    function buildQueryString() {
        const params = new URLSearchParams();
        const cameraId = cameraSelect?.value;
        const startDate = startAt?.value;
        const endDate = endAt?.value;
        if (cameraId) params.append("cameraId", cameraId);
        if (startDate) params.append("from", `${startDate}T00:00:00`);
        if (endDate) params.append("to", `${endDate}T23:59:59`);
        return params.toString();
    }

    function setLoading(isLoading) {
        if (loading) loading.hidden = !isLoading;
    }

    function renderRows(items) {
        resultCount.textContent = items.length ? `${items.length}건` : "-";
        if (!items.length) {
            eventsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:40px; color:#94a3b8;">조회된 데이터가 없습니다.</td></tr>`;
            return;
        }
        // 백엔드에서 계산되어 저장된 deltaCount(순증가량)를 표시
        eventsTableBody.innerHTML = items.map((item) => `
            <tr>
                <td>${escapeHtml(formatDateTime(item.eventTime || item.createdAt))}</td>
                <td>${escapeHtml(item.cameraName || "-")}</td>
                <td>${escapeHtml(item.productName || "-")}</td>
                <td style="font-weight:700; color:#2563eb;">${item.deltaCount ?? 0}</td>
            </tr>
        `).join("");
    }

    function updateSummary(items) {
        if (!items.length) {
            totalQtyEl.textContent = "0";
            totalEventsEl.textContent = "0";
            avgQtyEl.textContent = "0";
            peakHourEl.textContent = "-";
            return;
        }

        const hourlyData = Array(24).fill(0);
        let totalDelta = 0;

        items.forEach(item => {
            const delta = item.deltaCount || 0;
            totalDelta += delta;
            const hour = new Date(item.eventTime || item.createdAt).getHours();
            if (hour >= 0 && hour < 24) hourlyData[hour] += delta;
        });

        const eventCount = items.length;
        const avgQty = (totalDelta / eventCount).toFixed(1);

        let maxVal = -1;
        let peakHour = 0;
        hourlyData.forEach((val, hr) => {
            if (val > maxVal) {
                maxVal = val;
                peakHour = hr;
            }
        });

        totalQtyEl.textContent = totalDelta.toLocaleString();
        totalEventsEl.textContent = eventCount.toLocaleString();
        avgQtyEl.textContent = avgQty;
        peakHourEl.textContent = maxVal > 0 ? `${String(peakHour).padStart(2, "0")}시 (${maxVal.toLocaleString()})` : "-";
    }

    async function fetchComparison(todayNormalizedData) {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
            
            const camId = cameraSelect?.value;
            let url = `/api/history/events?from=${yStr}T00:00:00&to=${yStr}T23:59:59`;
            if (camId) url += `&cameraId=${camId}`;

            const response = await fetch(url, { cache: "no-store" });
            if (!response.ok) return;
            
            const yesterdayItems = await response.json();
            
            // 오늘과 어제의 deltaCount 합계 비교
            const todayTotal = todayNormalizedData.reduce((sum, item) => sum + (item.deltaCount || 0), 0);
            const yesterdayTotal = yesterdayItems.reduce((sum, item) => sum + (item.deltaCount || 0), 0);

            if (yesterdayTotal === 0) {
                compareValueEl.textContent = todayTotal > 0 ? "+100%" : "0%";
                compareValueEl.className = "value up";
                return;
            }

            const diffPercent = ((todayTotal - yesterdayTotal) / yesterdayTotal * 100).toFixed(0);
            const sign = diffPercent > 0 ? "+" : "";
            compareValueEl.textContent = `${sign}${diffPercent}%`;
            compareValueEl.className = diffPercent >= 0 ? "value up" : "value down";
        } catch (e) {
            console.error("비교 데이터 로드 실패", e);
        }
    }

    function renderChart(items) {
        const ctx = document.getElementById('historyChart')?.getContext('2d');
        if (!ctx) return;
        if (historyChartInstance) historyChartInstance.destroy();

        const hourlyData = Array(24).fill(0);
        items.forEach(item => {
            const hour = new Date(item.eventTime || item.createdAt).getHours();
            if (hour >= 0 && hour < 24) {
                hourlyData[hour] += (item.deltaCount || 0);
            }
        });

        const labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}시`);

        historyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '생산량',
                    data: hourlyData,
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderColor: 'rgb(37, 99, 235)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `순증가량: ${ctx.raw.toLocaleString()}개`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0, stepSize: 1 }
                    }
                }
            }
        });
    }

    function renderError(message) {
        eventsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:40px; color:#ef4444;">${escapeHtml(message)}</td></tr>`;
        resultCount.textContent = "-";
        if (historyChartInstance) historyChartInstance.destroy();
    }

    function formatDateTime(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "-";
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const mi = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
})();
