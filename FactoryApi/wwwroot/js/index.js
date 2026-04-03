const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");

const userInfoEl = document.getElementById("userInfo");
const cameraStatusEl = document.getElementById("cameraStatus");
const tokenExpireEl = document.getElementById("token-expire");
const tokenStatusEl = document.getElementById("token-status");

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
    location.href = "/roi.html";
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

async function startCamera() {
    if (!ensureLoggedIn()) return;

    const cameraId = 1;

    try {
        const res = await fetch(`/api/Camera/${cameraId}/start`, {
            method: "POST",
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;

        if (!res.ok) {
            alert("카메라 시작 실패");
            return;
        }

        alert("카메라 시작 요청 완료");
        await loadCameraStatus();
    } catch (error) {
        console.error(error);
        alert("카메라 시작 중 오류가 발생했습니다.");
    }
}

async function stopCamera() {
    if (!ensureLoggedIn()) return;

    const cameraId = 1;

    try {
        const res = await fetch(`/api/Camera/${cameraId}/stop`, {
            method: "POST",
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;

        if (!res.ok) {
            alert("카메라 중지 실패");
            return;
        }

        alert("카메라 중지 요청 완료");
        await loadCameraStatus();
    } catch (error) {
        console.error(error);
        alert("카메라 중지 중 오류가 발생했습니다.");
    }
}

async function loadCameraStatus() {
    if (!ensureLoggedIn()) return;

    const cameraId = 1;

    if (!cameraStatusEl) {
        console.warn("cameraStatus 요소를 찾을 수 없습니다.");
        return;
    }

    try {
        const res = await fetch(`/api/Camera/${cameraId}/status`, {
            headers: authHeaders()
        });

        if (await handleUnauthorized(res)) return;

        if (!res.ok) {
            cameraStatusEl.textContent = "카메라 상태 조회 실패";
            return;
        }

        const data = await res.json();

        cameraStatusEl.textContent =
            `CameraId: ${data.cameraId}
CameraName: ${data.cameraName}
Enabled: ${data.enabled}
Status: ${data.status}
Message: ${data.message}
ChangedAt: ${data.changedAt}`;
    } catch (error) {
        console.error(error);
        cameraStatusEl.textContent = "카메라 상태 조회 중 오류 발생";
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
        userInfoEl.innerText = `${username || "운영자"} 님 로그인됨`;
    }

    const expiresAt = localStorage.getItem("expiresAt");
    if (expiresAt && tokenExpireEl) {
        tokenExpireEl.innerText = "만료시간: " + expiresAt;
    }

    await loadCameraStatus();
});