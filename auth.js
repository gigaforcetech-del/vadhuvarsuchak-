// Authentication & Session Management
// Session timeout: 60 minutes (in milliseconds)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 60 minutes
const PROTECTED_PAGES = ['biodata.html', 'view-profile.html'];
let isRedirectingToLogin = false;

// Check if current page is protected
function isProtectedPage() {
  const currentPage = window.location.pathname.split('/').pop();
  return PROTECTED_PAGES.some(page => currentPage.includes(page));
}

// Get session data
function getSessionData() {
  const loggedIn = sessionStorage.getItem("loggedIn");
  const user = sessionStorage.getItem("loginUser");
  const loginTime = sessionStorage.getItem("loginTime");
  
  return { loggedIn, user, loginTime };
}

// Check if session is valid (not expired)
function isSessionValid() {
  const { loggedIn, loginTime } = getSessionData();
  
  if (!loggedIn || !loginTime) {
    return false;
  }
  
  const currentTime = Date.now();
  const timeElapsed = currentTime - parseInt(loginTime);
  
  // If session has timed out, clear it
  if (timeElapsed > SESSION_TIMEOUT) {
    clearSession();
    return false;
  }
  
  return true;
}

// Clear session data
function clearSession() {
  sessionStorage.removeItem("loggedIn");
  sessionStorage.removeItem("loginUser");
  sessionStorage.removeItem("loginTime");
}

// Logout function
function logout() {
  clearSession();
  alert("Session ended. You have been logged out.");
  window.location.href = "login.html";
}

// Check session periodically.
function startSessionCheck() {
  setInterval(() => {
    if (isProtectedPage() && !isSessionValid()) {
      expireSession();
    }
  }, 1000); // Check every second for accurate test logout
}

function expireSession() {
  if (isRedirectingToLogin) {
    return;
  }

  isRedirectingToLogin = true;
  clearSession();
  alert("Your session has expired. Please login again.");
  window.location.href = "login.html";
}

// Check authentication on page load
function checkAuthentication() {
  if (!isProtectedPage()) {
    return; // Not a protected page, allow access
  }
  
  if (!isSessionValid()) {
    clearSession();
    alert("Please login to access this page.");
    window.location.href = "login.html";
  } else {
    // Session is valid, setup timers
    updateSessionDisplay();
    startSessionCheck();
  }
}

// Update session info display in header (if available)
function updateSessionDisplay() {
  // Session display removed - element no longer in DOM
  const loginNameSpan = document.getElementById("loginName");
  if (loginNameSpan) {
    const { user } = getSessionData();
    if (user) {
      loginNameSpan.textContent = `👤 ${user}`;
    }
  }
}

// Update session timer display every minute
function startSessionDisplayUpdate() {
  setInterval(() => {
    updateSessionDisplay();
  }, 60000);
}

// Run checks when page loads
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  if (isProtectedPage() && isSessionValid()) {
    startSessionDisplayUpdate();
  }
});

// Re-check when returning via browser Back/Forward cache after logout.
window.addEventListener('pageshow', () => {
  if (isProtectedPage() && !isSessionValid() && !isRedirectingToLogin) {
    isRedirectingToLogin = true;
    window.location.href = "login.html";
  }
});

// Mobile browsers may pause timers when the phone locks or browser is backgrounded.
// Re-validate as soon as the user returns to the protected page.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isProtectedPage() && !isSessionValid()) {
    expireSession();
  }
});

window.addEventListener('focus', () => {
  if (isProtectedPage() && !isSessionValid()) {
    expireSession();
  }
});
