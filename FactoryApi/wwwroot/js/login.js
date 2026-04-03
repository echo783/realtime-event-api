async function login() {
    const usernameEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");

    if (!(usernameEl instanceof HTMLInputElement) || !(passwordEl instanceof HTMLInputElement)) {
        alert("로그인 입력 요소를 찾을 수 없습니다.");
        return;
    }

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "로그인 실패");
        return;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("username", data.username);

    if (data.expiresAt) {
        localStorage.setItem("expiresAt", data.expiresAt);
    }

    alert("로그인 성공");
    location.href = "/index.html";
} 