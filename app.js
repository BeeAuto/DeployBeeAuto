// Xử lý kiểm tra mật khẩu tại trang đăng nhập

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("access-form");
  const passwordInput = document.getElementById("password-input");
  const toggleBtn = document.getElementById("toggle-password");
  const statusMsg = document.getElementById("status-message");
  const submitBtn = document.getElementById("submit-btn");

  // Toggle ẩn/hiện mật khẩu
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      toggleBtn.innerHTML = isPassword
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  }

  // Xử lý gửi form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredPass = passwordInput.value.trim();

    if (!enteredPass) {
      showMessage("Vui lòng nhập mật khẩu!", "error");
      return;
    }

    // Hiệu ứng đang xử lý
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    statusMsg.className = "status-message";
    statusMsg.textContent = "";

    try {
      const enteredHash = await sha256(enteredPass);

      // Kiểm tra mật khẩu có nằm trong danh sách Plaintext hoặc Hash không
      const isPlainMatch = Array.isArray(CONFIG.allowedPasswords) && CONFIG.allowedPasswords.includes(enteredPass);
      const isHashMatch = Array.isArray(CONFIG.allowedHashes) && CONFIG.allowedHashes.includes(enteredHash);

      if (isPlainMatch || isHashMatch) {
        // Lưu phiên đăng nhập hợp lệ
        sessionStorage.setItem("access_authorized", "true");
        sessionStorage.setItem("auth_time", Date.now().toString());

        showMessage("Mật khẩu chính xác! Đang chuyển hướng...", "success");

        setTimeout(() => {
          window.location.href = "./download.html";
        }, 600);
      } else {
        showMessage("Mật khẩu không đúng. Vui lòng thử lại!", "error");
        form.classList.add("shake");
        setTimeout(() => form.classList.remove("shake"), 500);
        passwordInput.focus();
        passwordInput.select();
      }
    } catch (err) {
      console.error(err);
      showMessage("Đã có lỗi xảy ra khi kiểm tra mật mã.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });

  function showMessage(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `status-message visible ${type}`;
  }
});
