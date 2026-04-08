const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");
let cameraId = 1;

const userInfoEl = document.getElementById("userInfo");
const secureUserInfoEl = document.getElementById("secureUserInfo");
const cameraStatusEl = document.getElementById("cameraStatus");
const tokenExpireEl = document.getElementById("token-expire");
const tokenStatusEl = document.getElementById("token-status");
const cameraSelectEl = document.getElementById("cameraSelect");
const hubStateBadgeEl = document.getElementById("hubStateBadge");
const eventLogEl = document.getElementById("eventLog");
const btnStartEl = document.getElementById("btnStart");
const btnStopEl = document.getElementById("btnStop");
const btnStatusEl = document.getElementById("btnStatus");
const kpiCameraNameEl = document.getElementById("kpiCameraName");
const kpiCameraStatusEl = document.getElementById("kpiCameraStatus");
const kpiHubStateEl = document.getElementById("kpiHubState");
const kpiLastUpdatedEl = document.getElementById("kpiLastUpdated");
let signalRConnection = null;
let joinedCameraGroupId = null;
const MAX_EVENT_LOG = 20;

function redirectToLogin() {
    location.href = "/login.html";
}

function ensureLoggedIn() {
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        redirectToLogin();
        return false;
    }
    return true;
}

function authHeaders(extra = {}) {
    return {
        "Authorization": "Bearer " + accessToken,
        ...extra
    };
}

async function handleUnauthorized(res) {
    if (res.status === 401) {
        alert("세션 만료. 다시 로그인하세요.");
        redirectToLogin();
        return true;
    }
    return false;
}

function goRoi() {
    location.href = `/roi.html?cameraId=${cameraId}`;
}

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    redirectToLogin();
}

async function checkAuth() {
    if (!ensureLoggedIn()) return;

    try {
        const res = await fetch("/api/secure/me", {
            method: "GET",
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;

        if (!res.ok) {
            alert("인증 실패");
            return;
        }

        const data = await res.json();
        alert(`${data.message} / 사용자: ${data.username}`);
    } catch (error) {
        console.error(error);
        alert("인증 확인 중 오류가 발생했습니다.");
    }
}

async function loadSecureUserInfo() {
    if (!ensureLoggedIn()) return;
    if (!secureUserInfoEl) return;

    try {
        const res = await fetch("/api/secure/me", {
            method: "GET",
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;

        if (!res.ok) {
            secureUserInfoEl.innerText = "사용자 정보를 불러오지 못했습니다.";
            return;
        }

        const data = await res.json();
        secureUserInfoEl.innerText = `운영자: ${data.username}`;
    } catch (error) {
        console.error(error);
        secureUserInfoEl.innerText = "사용자 정보 조회 중 오류가 발생했습니다.";
    }
}

function pushEventLog(message) {
    if (!(eventLogEl instanceof HTMLElement)) return;

    const item = document.createElement("li");
    item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    eventLogEl.prepend(item);

    while (eventLogEl.childElementCount > MAX_EVENT_LOG) {
        eventLogEl.removeChild(eventLogEl.lastElementChild);
    }
}

function setHubState(state) {
    if (state === "connected") {
        if (hubStateBadgeEl instanceof HTMLElement) {
            hubStateBadgeEl.textContent = "Connected";
            hubStateBadgeEl.className = "status-badge status--running";
        }
        if (kpiHubStateEl instanceof HTMLElement) {
            kpiHubStateEl.textContent = "Connected";
        }
        return;
    }

    if (state === "reconnecting") {
        if (hubStateBadgeEl instanceof HTMLElement) {
            hubStateBadgeEl.textContent = "Reconnecting";
            hubStateBadgeEl.className = "status-badge status--warn";
        }
        if (kpiHubStateEl instanceof HTMLElement) {
            kpiHubStateEl.textContent = "Reconnecting";
        }
        return;
    }

    if (hubStateBadgeEl instanceof HTMLElement) {
        hubStateBadgeEl.textContent = "Disconnected";
        hubStateBadgeEl.className = "status-badge status--error";
    }
    if (kpiHubStateEl instanceof HTMLElement) {
        kpiHubStateEl.textContent = "Disconnected";
    }
}

function setButtonBusy(button, isBusy, busyText) {
    if (!(button instanceof HTMLButtonElement)) return;

    if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent || "";
    }

    if (isBusy) {
        button.disabled = true;
        button.classList.add("btn-loading");
        if (busyText) button.textContent = busyText;
        return;
    }

    button.disabled = false;
    button.classList.remove("btn-loading");
    button.textContent = button.dataset.originalText || button.textContent || "";
}

function renderCameraStatus(data) {
    if (!cameraStatusEl) return;

    const status = data.status || "Unknown";
    const statusClass = status === "Running"
        ? "status--running"
        : status === "Stopped"
            ? "status--stopped"
            : status === "Error"
                ? "status--error"
                : "status--warn";

    const changedAt = formatLocalDateTime(data.changedAt);

    cameraStatusEl.innerHTML =
        `<div class="camera-status__header">
            <span class="camera-status__label">상태</span>
            <span class="status-badge ${statusClass}">${status}</span>
        </div>
        <div class="camera-status__meta">
            <div class="camera-status__meta-item">
                <span class="camera-status__meta-label">CameraId</span>
                <span class="camera-status__meta-value">${data.cameraId}</span>
            </div>
            <div class="camera-status__meta-item">
                <span class="camera-status__meta-label">CameraName</span>
                <span class="camera-status__meta-value">${data.cameraName}</span>
            </div>
            <div class="camera-status__meta-item">
                <span class="camera-status__meta-label">Enabled</span>
                <span class="camera-status__meta-value">${data.enabled}</span>
            </div>
            <div class="camera-status__meta-item">
                <span class="camera-status__meta-label">ChangedAt</span>
                <span class="camera-status__meta-value">${changedAt}</span>
            </div>
        </div>
        <div class="camera-status__message">
            <strong>Message:</strong> ${data.message}
        </div>`;

    if (kpiCameraNameEl instanceof HTMLElement) {
        kpiCameraNameEl.textContent = data.cameraName || "-";
    }
    if (kpiCameraStatusEl instanceof HTMLElement) {
        kpiCameraStatusEl.textContent = status;
        kpiCameraStatusEl.className = `status-badge ${statusClass}`;
    }
    if (kpiLastUpdatedEl instanceof HTMLElement) {
        kpiLastUpdatedEl.textContent = changedAt;
    }
}

function formatLocalDateTime(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString();
}

function renderCameraOptions(cameras) {
    if (!(cameraSelectEl instanceof HTMLSelectElement)) return;

    cameraSelectEl.innerHTML = "";
    cameras.forEach((cam) => {
        const option = document.createElement("option");
        option.value = String(cam.cameraId);
        option.textContent = `${cam.cameraName} (${cam.cameraId}) - ${cam.enabled ? "사용중" : "비활성"}`;
        cameraSelectEl.appendChild(option);
    });
}

async function ensureSignalRScriptLoaded() {
    if (window.signalR) return;

    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/8.0.7/signalr.min.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("SignalR 스크립트 로드 실패"));
        document.head.appendChild(script);
    });
}

async function connectCameraStatusHub() {
    if (!ensureLoggedIn()) return;
    if (!cameraStatusEl) return;

    try {
        await ensureSignalRScriptLoaded();

        if (signalRConnection) {
            await signalRConnection.stop();
            signalRConnection = null;
        }

        signalRConnection = new window.signalR.HubConnectionBuilder()
            .withUrl("/hubs/camera", {
                accessTokenFactory: () => localStorage.getItem("accessToken") || ""
            })
            .withAutomaticReconnect()
            .build();

        signalRConnection.on("CameraStatusChanged", (payload) => {
            loadCameraOptions();
            if (Number(payload?.cameraId) !== cameraId) return;
            renderCameraStatus(payload);
            pushEventLog(`카메라 ${payload.cameraId} 상태 변경: ${payload.status}`);
        });

        signalRConnection.onreconnecting(() => {
            setHubState("reconnecting");
            pushEventLog("SignalR 재연결 시도 중");
            if (cameraStatusEl) {
                cameraStatusEl.textContent = "실시간 연결 재시도 중...";
            }
        });

        signalRConnection.onreconnected(() => {
            console.log(`[SignalR] reconnected. rejoin camera-${cameraId}`);
            switchCameraGroup(cameraId);
            loadCameraStatus();
            setHubState("connected");
            pushEventLog("SignalR 재연결 완료");
        });

        signalRConnection.onclose(() => {
            setHubState("disconnected");
            pushEventLog("SignalR 연결 종료");
        });

        await signalRConnection.start();
        setHubState("connected");
        pushEventLog("SignalR 연결 성공");
        await switchCameraGroup(cameraId);
    } catch (error) {
        console.error(error);
        setHubState("disconnected");
        pushEventLog("SignalR 연결 실패");
        if (cameraStatusEl) {
            cameraStatusEl.textContent = "실시간 연결 실패 (기존 조회 기능은 사용 가능)";
        }
    }
}

async function switchCameraGroup(nextCameraId) {
    if (!signalRConnection) return;
    if (signalRConnection.state !== "Connected") return;

    if (joinedCameraGroupId === nextCameraId) return;

    if (joinedCameraGroupId !== null) {
        console.log(`[SignalR] LeaveCameraGroup start: camera-${joinedCameraGroupId}`);
        pushEventLog(`그룹 이탈: camera-${joinedCameraGroupId}`);
        await signalRConnection.invoke("LeaveCameraGroup", joinedCameraGroupId);
        console.log(`[SignalR] LeaveCameraGroup done: camera-${joinedCameraGroupId}`);
    }

    console.log(`[SignalR] JoinCameraGroup start: camera-${nextCameraId}`);
    pushEventLog(`그룹 가입: camera-${nextCameraId}`);
    await signalRConnection.invoke("JoinCameraGroup", nextCameraId);
    console.log(`[SignalR] JoinCameraGroup done: camera-${nextCameraId}`);
    joinedCameraGroupId = nextCameraId;
}

async function loadCameraOptions() {
    if (!ensureLoggedIn()) return;
    if (!(cameraSelectEl instanceof HTMLSelectElement)) return;

    try {
        const selectedCameraId = cameraId;
        const res = await fetch("/api/Camera/list", {
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;

        if (!res.ok) {
            cameraStatusEl.textContent = "카메라 목록을 불러오지 못했습니다.";
            return;
        }

        const cameras = await res.json();

        if (!Array.isArray(cameras) || cameras.length === 0) {
            cameraStatusEl.textContent = "등록된 카메라가 없습니다.";
            return;
        }

        renderCameraOptions(cameras);

        const hasSelected = cameras.some((cam) => Number(cam.cameraId) === selectedCameraId);
        cameraId = hasSelected
            ? selectedCameraId
            : (Number(cameras[0].cameraId) || 1);
        cameraSelectEl.value = String(cameraId);
    } catch (error) {
        console.error(error);
        cameraStatusEl.textContent = "카메라 목록 조회 중 오류가 발생했습니다.";
    }
}

async function startCamera() {
    if (!ensureLoggedIn()) return;
    if (!cameraStatusEl) return;
    setButtonBusy(btnStartEl, true, "시작 중");

    try {
        const res = await fetch(`/api/Camera/${cameraId}/start`, {
            method: "POST",
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;
        if (res.status === 404) {
            cameraStatusEl.textContent = "선택한 카메라가 등록되어 있지 않습니다.";
            pushEventLog(`카메라 ${cameraId} 시작 실패: 미등록 카메라`);
            return;
        }

        if (!res.ok) {
            cameraStatusEl.textContent = "카메라 시작 실패";
            pushEventLog(`카메라 ${cameraId} 시작 실패`);
            return;
        }

        cameraStatusEl.textContent = "카메라 시작 요청 성공";
        pushEventLog(`카메라 ${cameraId} 시작 요청 성공`);
        await loadCameraOptions();
        await loadCameraStatus();
    } catch (error) {
        console.error(error);
        cameraStatusEl.textContent = "카메라 시작 중 오류가 발생했습니다.";
        pushEventLog(`카메라 ${cameraId} 시작 오류`);
    } finally {
        setButtonBusy(btnStartEl, false);
    }
}

async function stopCamera() {
    if (!ensureLoggedIn()) return;
    if (!cameraStatusEl) return;
    setButtonBusy(btnStopEl, true, "중지 중");

    try {
        const res = await fetch(`/api/Camera/${cameraId}/stop`, {
            method: "POST",
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;
        if (res.status === 404) {
            cameraStatusEl.textContent = "선택한 카메라가 등록되어 있지 않습니다.";
            pushEventLog(`카메라 ${cameraId} 중지 실패: 미등록 카메라`);
            return;
        }

        if (!res.ok) {
            cameraStatusEl.textContent = "카메라 중지 실패";
            pushEventLog(`카메라 ${cameraId} 중지 실패`);
            return;
        }

        cameraStatusEl.textContent = "카메라 중지 요청 성공";
        pushEventLog(`카메라 ${cameraId} 중지 요청 성공`);
        await loadCameraOptions();
        await loadCameraStatus();
    } catch (error) {
        console.error(error);
        cameraStatusEl.textContent = "카메라 중지 중 오류가 발생했습니다.";
        pushEventLog(`카메라 ${cameraId} 중지 오류`);
    } finally {
        setButtonBusy(btnStopEl, false);
    }
}

async function loadCameraStatus(fromButton = false) {
    if (!ensureLoggedIn()) return;

    if (!cameraStatusEl) {
        console.warn("cameraStatus 요소를 찾을 수 없습니다.");
        return;
    }

    if (fromButton) {
        setButtonBusy(btnStatusEl, true, "조회 중");
    }

    try {
        const res = await fetch(`/api/Camera/${cameraId}/status`, {
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;
        if (res.status === 404) {
            cameraStatusEl.textContent = "선택한 카메라가 등록되어 있지 않습니다.";
            pushEventLog(`카메라 ${cameraId} 상태 조회 실패: 미등록 카메라`);
            return;
        }

        if (!res.ok) {
            cameraStatusEl.textContent = "카메라 상태 조회 실패";
            pushEventLog(`카메라 ${cameraId} 상태 조회 실패`);
            return;
        }

        const data = await res.json();
        renderCameraStatus(data);
    } catch (error) {
        console.error(error);
        cameraStatusEl.textContent = "카메라 상태 조회 중 오류 발생";
        pushEventLog(`카메라 ${cameraId} 상태 조회 오류`);
    } finally {
        if (fromButton) {
            setButtonBusy(btnStatusEl, false);
        }
    }
}

function copyAccessToken() {
    const copiedToken = localStorage.getItem("accessToken");

    if (!copiedToken) {
        alert("AccessToken 없음");
        return;
    }

    navigator.clipboard.writeText(copiedToken)
        .then(() => {
            if (tokenStatusEl) {
                tokenStatusEl.innerText = "AccessToken 복사 완료!";
            }
        })
        .catch((error) => {
            console.error(error);
            alert("복사 실패");
        });
}

window.addEventListener("DOMContentLoaded", async () => {
    if (!ensureLoggedIn()) return;

    if (userInfoEl) {
        userInfoEl.innerText = `운영자: ${username || "admin"}`;
    }

    const expiresAt = localStorage.getItem("expiresAt");
    if (expiresAt && tokenExpireEl) {
        tokenExpireEl.innerText = "만료시간: " + expiresAt;
    }

    if (cameraSelectEl instanceof HTMLSelectElement) {
        cameraSelectEl.addEventListener("change", async () => {
            cameraId = Number(cameraSelectEl.value) || 1;
            await switchCameraGroup(cameraId);
            await loadCameraStatus();
        });
    }

    await loadSecureUserInfo();
    setHubState("reconnecting");
    await loadCameraOptions();
    await connectCameraStatusHub();
    await loadCameraStatus();
});