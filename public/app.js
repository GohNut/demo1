/**
 * Sukjai Club LINE LIFF Member Profile Client Application
 * Governed by design.md specifications
 */

(function () {
  'use strict';

  // Bundled sample portrait photo for preview mode (reads as a real member photo)
  const SAMPLE_AVATAR_URL = '/images/sample-avatar.svg';

  // DOM Elements
  const previewBar = document.getElementById('preview-bar');
  const selectPreviewState = document.getElementById('select-preview-state');
  const selectPreviewCase = document.getElementById('select-preview-case');
  const rowPreviewCase = document.getElementById('row-preview-case');

  const viewLoading = document.getElementById('view-loading');
  const viewProfile = document.getElementById('view-profile');
  const viewUnauth = document.getElementById('view-unauth');
  const viewError = document.getElementById('view-error');

  const avatarContainer = document.getElementById('avatar-container');
  const avatarImg = document.getElementById('avatar-img');
  const avatarFallback = document.getElementById('avatar-fallback');
  const displayNameEl = document.getElementById('display-name');
  const statusMessageEl = document.getElementById('status-message');
  const memberNumberEl = document.getElementById('member-number');
  const supportUserIdEl = document.getElementById('support-user-id');
  const errorDescText = document.getElementById('error-desc-text');

  const btnCopyId = document.getElementById('btn-copy-id');
  const btnRefresh = document.getElementById('btn-refresh');
  const btnCloseWindow = document.getElementById('btn-close-window');
  const btnLogin = document.getElementById('btn-login');
  const btnRetry = document.getElementById('btn-retry');
  const btnErrorClose = document.getElementById('btn-error-close');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  let toastTimeout = null;
  let isPreviewMode = false;
  let currentAppConfig = { liffId: '', configured: false };

  // Toast notification helper
  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastText.textContent = message;
    toast.classList.add('is-active');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-active');
    }, 2000);
  }

  // Switch between the main view states
  function showState(stateName) {
    viewLoading.style.display = 'none';
    viewProfile.style.display = 'none';
    viewUnauth.style.display = 'none';
    viewError.style.display = 'none';

    if (rowPreviewCase) {
      // Awkward test case selector is only applicable when inspecting signed-in profile cards
      rowPreviewCase.style.display = (stateName === 'state-signed-in' || stateName === 'state-missing-avatar') ? 'flex' : 'none';
    }

    switch (stateName) {
      case 'state-loading':
        viewLoading.style.display = 'flex';
        break;
      case 'state-signed-in':
        viewProfile.style.display = 'block';
        break;
      case 'state-missing-avatar':
        viewProfile.style.display = 'block';
        break;
      case 'state-unauthenticated':
        viewUnauth.style.display = 'flex';
        break;
      case 'state-error':
        viewError.style.display = 'flex';
        break;
      default:
        viewProfile.style.display = 'block';
    }
  }

  // Copy Member ID to Clipboard
  function handleCopyMemberId() {
    const textToCopy = memberNumberEl.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('คัดลอกหมายเลขสมาชิกแล้ว');
      }).catch(() => {
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('คัดลอกหมายเลขสมาชิกแล้ว');
    } catch (e) {
      showToast('ไม่สามารถคัดลอกได้');
    }
    document.body.removeChild(textArea);
  }

  // Update profile card fields
  function updateProfileDisplay(data) {
    // 1. Avatar
    if (data.pictureUrl) {
      avatarImg.src = data.pictureUrl;
      avatarImg.style.display = 'block';
      avatarFallback.style.display = 'none';
      avatarImg.alt = 'รูปโปรไฟล์ LINE ของคุณ';
    } else {
      avatarImg.style.display = 'none';
      avatarFallback.style.display = 'block';
    }

    // 2. Display Name
    displayNameEl.textContent = data.displayName || 'สมาชิก LINE';
    displayNameEl.title = data.displayName || 'สมาชิก LINE';

    // 3. Status Message
    if (data.statusMessage && data.statusMessage.trim()) {
      statusMessageEl.textContent = `“${data.statusMessage.trim()}”`;
      statusMessageEl.classList.remove('is-empty');
    } else {
      statusMessageEl.textContent = '';
      statusMessageEl.classList.add('is-empty');
    }

    // 4. Member Meta
    memberNumberEl.textContent = data.memberNumber || 'MB-0000-0000';
    supportUserIdEl.textContent = data.userId || 'U1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6';
  }

  // PREVIEW MODE LOGIC
  function initPreviewMode() {
    isPreviewMode = true;
    previewBar.classList.add('is-visible');

    const sampleData = {
      pictureUrl: SAMPLE_AVATAR_URL,
      displayName: 'สมชาย ใจดี',
      statusMessage: 'สุขใจทุกวันที่ได้พบกัน',
      memberNumber: 'MB-9767-6679',
      userId: 'U1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6'
    };

    // Apply initial state from URL if specified
    const urlParams = new URLSearchParams(window.location.search);
    const requestedState = urlParams.get('state');

    function applyPreviewCase(caseKey, forceMissingAvatar = false) {
      const activeData = { ...sampleData };

      if (forceMissingAvatar) {
        activeData.pictureUrl = null;
      }

      switch (caseKey) {
        case 'long-name':
          activeData.displayName = 'นายสมศักดิ์ มหาดำรงค์กุลพิพัฒน์วัฒนาไพศาลยิ่งยวด';
          activeData.statusMessage = 'ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น เพื่อความสุขของทุกคนในครอบครัวและองค์กร';
          break;
        case 'emoji-name':
          activeData.displayName = '🌿✨☕️⭐️🎉';
          activeData.statusMessage = '🍰💖🍩';
          break;
        case 'no-status':
          activeData.statusMessage = '';
          break;
        case 'normal':
        default:
          break;
      }

      updateProfileDisplay(activeData);
    }

    // State switcher listener
    selectPreviewState.addEventListener('change', (e) => {
      const state = e.target.value;
      if (state === 'state-missing-avatar') {
        applyPreviewCase(selectPreviewCase.value, true);
        showState('state-missing-avatar');
      } else if (state === 'state-signed-in') {
        applyPreviewCase(selectPreviewCase.value, false);
        showState('state-signed-in');
      } else {
        showState(state);
      }
    });

    // Awkward cases switcher listener
    selectPreviewCase.addEventListener('change', (e) => {
      const isMissingAvatar = selectPreviewState.value === 'state-missing-avatar';
      applyPreviewCase(e.target.value, isMissingAvatar);
    });

    // Wire up buttons for Preview Mode
    btnRefresh.addEventListener('click', () => {
      btnRefresh.classList.add('is-busy');
      showToast('กำลังรีเฟรชข้อมูล (Preview)...');
      setTimeout(() => {
        btnRefresh.classList.remove('is-busy');
        showToast('ข้อมูลอัปเดตล่าสุดแล้ว');
      }, 600);
    });

    btnCloseWindow.addEventListener('click', () => {
      showToast('[Preview] ใน LINE จริงจะปิดหน้าต่าง LIFF (liff.closeWindow)');
    });

    btnLogin.addEventListener('click', () => {
      showToast('[Preview] ในโหมดจริงจะเรียก liff.login() เพื่อเข้าสู่ระบบ');
    });

    btnRetry.addEventListener('click', () => {
      selectPreviewState.value = 'state-signed-in';
      applyPreviewCase(selectPreviewCase.value);
      showState('state-signed-in');
      showToast('โหลดข้อมูลสำเร็จ');
    });

    btnErrorClose.addEventListener('click', () => {
      showToast('[Preview] ปิดหน้านี้');
    });

    // Handle initial state setup
    if (requestedState) {
      if (requestedState === 'loading') {
        selectPreviewState.value = 'state-loading';
        showState('state-loading');
      } else if (requestedState === 'error') {
        selectPreviewState.value = 'state-error';
        showState('state-error');
      } else if (requestedState === 'unauth' || requestedState === 'unauthenticated') {
        selectPreviewState.value = 'state-unauthenticated';
        showState('state-unauthenticated');
      } else if (requestedState === 'missing-avatar') {
        selectPreviewState.value = 'state-missing-avatar';
        applyPreviewCase('normal', true);
        showState('state-missing-avatar');
      } else if (requestedState === 'long-name') {
        selectPreviewState.value = 'state-signed-in';
        selectPreviewCase.value = 'long-name';
        applyPreviewCase('long-name', false);
        showState('state-signed-in');
      } else if (requestedState === 'emoji') {
        selectPreviewState.value = 'state-signed-in';
        selectPreviewCase.value = 'emoji-name';
        applyPreviewCase('emoji-name', false);
        showState('state-signed-in');
      } else {
        selectPreviewState.value = 'state-signed-in';
        applyPreviewCase('normal', false);
        showState('state-signed-in');
      }
    } else {
      selectPreviewState.value = 'state-signed-in';
      applyPreviewCase('normal', false);
      showState('state-signed-in');
    }
  }

  // REAL AUTHENTICATED LIFF MODE
  async function initRealLiffMode(liffId) {
    showState('state-loading');

    if (typeof liff === 'undefined') {
      errorDescText.textContent = 'ไม่พบ LINE LIFF SDK กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      showState('state-error');
      return;
    }

    try {
      await liff.init({ liffId });

      if (!liff.isLoggedIn()) {
        showState('state-unauthenticated');
        btnLogin.addEventListener('click', () => {
          liff.login();
        });
        return;
      }

      // User is logged in to LINE
      await loadRealMemberProfile();

    } catch (err) {
      console.error('LIFF initialization error:', err);
      errorDescText.textContent = `เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE: ${err.message || 'ไม่ทราบสาเหตุ'}`;
      showState('state-error');
    }
  }

  async function loadRealMemberProfile() {
    showState('state-loading');

    try {
      const [profile, idToken] = await Promise.all([
        liff.getProfile(),
        liff.getIDToken()
      ]);

      if (!idToken) {
        throw new Error('ไม่สามารถดึง LINE ID Token ได้');
      }

      // Send ID Token to backend server for verification and member record
      const response = await fetch('/api/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `HTTP error ${response.status}`);
      }

      const memberData = await response.json();

      updateProfileDisplay({
        pictureUrl: profile.pictureUrl,
        displayName: profile.displayName,
        statusMessage: profile.statusMessage,
        memberNumber: memberData.memberNumber,
        userId: profile.userId
      });

      showState('state-signed-in');

    } catch (err) {
      console.error('Failed to load member profile:', err);
      errorDescText.textContent = `ไม่สามารถยืนยันตัวตนสมาชิกได้: ${err.message}`;
      showState('state-error');
    }
  }

  // Set up real mode button listeners
  function setupRealModeListeners() {
    btnRefresh.addEventListener('click', async () => {
      btnRefresh.classList.add('is-busy');
      await loadRealMemberProfile();
      btnRefresh.classList.remove('is-busy');
      showToast('รีเฟรชข้อมูลสำเร็จ');
    });

    btnCloseWindow.addEventListener('click', () => {
      if (typeof liff !== 'undefined' && liff.closeWindow) {
        liff.closeWindow();
      } else {
        window.close();
      }
    });

    btnRetry.addEventListener('click', () => {
      if (currentAppConfig.liffId) {
        initRealLiffMode(currentAppConfig.liffId);
      } else {
        initPreviewMode();
      }
    });

    btnErrorClose.addEventListener('click', () => {
      if (typeof liff !== 'undefined' && liff.closeWindow) {
        liff.closeWindow();
      } else {
        window.close();
      }
    });
  }

  // Application Entry Point
  async function initApp() {
    // Copy ID button is always active across modes
    btnCopyId.addEventListener('click', handleCopyMemberId);

    const urlParams = new URLSearchParams(window.location.search);
    const forcePreview = urlParams.get('preview') === 'true' || urlParams.has('state');

    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        currentAppConfig = await res.json();
      }
    } catch (err) {
      console.warn('Could not fetch /api/config, defaulting to preview mode:', err);
    }

    if (forcePreview || !currentAppConfig.configured) {
      initPreviewMode();
    } else {
      setupRealModeListeners();
      initRealLiffMode(currentAppConfig.liffId);
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
