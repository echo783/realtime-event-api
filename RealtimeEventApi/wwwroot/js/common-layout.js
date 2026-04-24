(function() {
  const currentPath = location.pathname.toLowerCase();

  function getActiveKey() {
    if (currentPath.includes("camera-management")) return "camera";
    if (currentPath.includes("history")) return "history";
    if (currentPath.includes("inventory")) return "inventory";
    if (currentPath.includes("roi")) return "roi";
    if (currentPath.includes("about")) return "about";
    return "home";
  }

  function getCurrentCameraId() {
    const select = document.getElementById("cameraSelect");
    if (select && select.value) return encodeURIComponent(select.value);

    const url = new URL(location.href);
    const q = url.searchParams.get("cameraId");
    return q ? encodeURIComponent(q) : "";
  }

  function buildHeader() {
    const active = getActiveKey();
    const cameraId = getCurrentCameraId();
    const roiHref = cameraId ? `/roi.html?cameraId=${cameraId}` : "/roi.html";

    return `
      <header class="app-header">
        <div class="app-header__bar">
          <div class="app-header__left">
            <a href="/index.html" class="app-header__title">AIMS</a>
            <nav class="app-nav" aria-label="메인 메뉴">
              <a href="/index.html" class="app-nav__link ${active === "home" ? "is-active" : ""}">대시보드</a>
              <a href="/camera-management.html" class="app-nav__link ${active === "camera" ? "is-active" : ""}">카메라</a>
              <a href="/history.html" class="app-nav__link ${active === "history" ? "is-active" : ""}">이력분석</a>
              <a href="/inventory.html" class="app-nav__link ${active === "inventory" ? "is-active" : ""}">생산</a>
              <a href="${roiHref}" class="app-nav__link ${active === "roi" ? "is-active" : ""}">AI 설정</a>
              <a href="/about.html" class="app-nav__link ${active === "about" ? "is-active" : ""}">소개</a>
            </nav>
          </div>

          <div class="app-header__right">
            <div class="app-header__hub" aria-live="polite">
              <span class="app-header__hub-label">Live</span>
              <span id="globalHubBadge" class="app-badge app-badge--neutral">Syncing</span>
            </div>

            <div class="app-header__user">
              <span id="globalUserName">admin</span>
              <button id="globalLogoutBtn" class="app-btn app-btn--ghost" type="button">Logout</button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function buildFooter() {
    return `
      <footer class="app-footer">
        <div class="app-footer__inner app-bgm">
          <audio id="bgmAudio" src="/assets/audio/aims-theme.mp3" loop autoplay muted preload="auto"></audio>
          <span class="app-bgm__label">Lyria AI BGM</span>
          <button id="bgmOnBtn" class="app-bgm__btn" type="button">ON</button>
          <button id="bgmOffBtn" class="app-bgm__btn" type="button">OFF</button>
          <label class="app-bgm__volume">
            <span>VOL</span>
            <input id="bgmVolume" class="app-bgm__slider" type="range" min="0" max="1" step="0.01" value="0.55" aria-label="BGM volume" />
          </label>
        </div>
      </footer>
    `;
  }

  function setupBgmControls() {
    const audio = document.getElementById("bgmAudio");
    const onBtn = document.getElementById("bgmOnBtn");
    const offBtn = document.getElementById("bgmOffBtn");
    const volume = document.getElementById("bgmVolume");
    if (!audio || !onBtn || !offBtn || !volume) return;

    const storedVolume = Number(localStorage.getItem("aimsBgmVolume"));
    const initialVolume = Number.isFinite(storedVolume) ? Math.max(0, Math.min(1, storedVolume)) : 0.55;
    const shouldPlay = localStorage.getItem("aimsBgmEnabled") === "true";

    volume.value = String(initialVolume);
    audio.volume = initialVolume;
    audio.muted = true;

    const setActive = (isOn, needsClick = false) => {
      onBtn.classList.toggle("is-active", isOn);
      offBtn.classList.toggle("is-active", !isOn);
      onBtn.textContent = needsClick ? "Click to Play" : "ON";
    };

    setActive(false);

    const playBgm = async () => {
      audio.muted = false;
      audio.volume = Number(volume.value);
      try {
        await audio.play();
        localStorage.setItem("aimsBgmEnabled", "true");
        setActive(true);
      } catch (error) {
        audio.pause();
        audio.muted = true;
        localStorage.setItem("aimsBgmEnabled", "false");
        setActive(false, true);
        console.warn("BGM play failed", error);
      }
    };

    onBtn.addEventListener("click", async () => {
      await playBgm();
    });

    offBtn.addEventListener("click", () => {
      audio.pause();
      localStorage.setItem("aimsBgmEnabled", "false");
      setActive(false);
    });

    volume.addEventListener("input", () => {
      const nextVolume = Number(volume.value);
      audio.volume = nextVolume;
      localStorage.setItem("aimsBgmVolume", String(nextVolume));
    });

    localStorage.setItem("aimsBgmVolume", String(initialVolume));

    if (shouldPlay) {
      playBgm();
    }
  }

  function injectLayout() {
    const headerRoot = document.getElementById("app-header");
    const footerRoot = document.getElementById("app-footer");

    if (headerRoot) headerRoot.innerHTML = buildHeader();
    if (footerRoot) footerRoot.innerHTML = buildFooter();

    const userName =
      localStorage.getItem("username") ||
      localStorage.getItem("userName") ||
      "admin";

    const userEl = document.getElementById("globalUserName");
    if (userEl) {
      userEl.textContent = userName;
    }

    const logoutBtn = document.getElementById("globalLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("userName");
        location.href = "/login.html";
      });
    }

    setupBgmControls();
  }

  window.updateGlobalHubState = function(state, text) {
    const badge = document.getElementById("globalHubBadge");
    if (!badge) return;

    badge.className = "app-badge";
    if (state === "connected") {
      badge.classList.add("app-badge--ok");
      badge.textContent = text || "Live";
    } else if (state === "reconnecting") {
      badge.classList.add("app-badge--warn");
      badge.textContent = text || "Wait";
    } else if (state === "disconnected") {
      badge.classList.add("app-badge--danger");
      badge.textContent = text || "Off";
    } else {
      badge.classList.add("app-badge--neutral");
      badge.textContent = text || "Sync";
    }
  };

  document.addEventListener("DOMContentLoaded", injectLayout);
})();
