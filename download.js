// Xử lý trang tải xuống: Tự động phát hiện file[0] trong folder files mà không cần hardcode

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Kiểm tra phiên truy cập hợp lệ
  const isAuthorized = sessionStorage.getItem("access_authorized") === "true";

  if (!isAuthorized) {
    alert("Vui lòng nhập License trước khi truy cập trang tải tệp!");
    window.location.replace("./index.html");
    return;
  }

  const downloadLink = document.getElementById("download-link");
  const fileNameEl = document.getElementById("file-name");
  const logoutBtn = document.getElementById("logout-btn");

  function setFileData(name, path) {
    if (fileNameEl) {
      fileNameEl.textContent = name;
    }
    if (downloadLink) {
      downloadLink.setAttribute("href", path);
      downloadLink.setAttribute("download", name);
      downloadLink.classList.remove("disabled");
    }
  }

  // Tự động tìm file đầu tiên trong thư mục files/
  async function detectFirstFile() {
    // 1. Thử qua GitHub API (hoạt động tự động khi deploy trên GitHub Pages hoặc có cấu hình repo)
    try {
      let repoFullName = CONFIG?.githubRepo?.trim();

      const host = window.location.hostname;
      if (!repoFullName && host.endsWith(".github.io")) {
        const username = host.replace(".github.io", "");
        const pathSegments = window.location.pathname.split("/").filter(Boolean);
        if (pathSegments.length > 0) {
          repoFullName = `${username}/${pathSegments[0]}`;
        }
      }

      if (repoFullName) {
        const apiUrl = `https://api.github.com/repos/${repoFullName}/contents/files`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items) && items.length > 0) {
            // Lấy file zip đầu tiên hoặc file đầu tiên trong danh sách
            const firstZip = items.find(item => item.type === "file" && item.name.toLowerCase().endsWith(".zip"));
            const target = firstZip || items.find(item => item.type === "file");
            if (target) {
              setFileData(target.name, `./files/${target.name}`);
              return true;
            }
          }
        }
      }
    } catch (e) {
      console.warn("GitHub API error:", e);
    }

    // 2. Thử qua Local Directory Listing (khi chạy qua local web server)
    try {
      const res = await fetch("./files/");
      if (res.ok) {
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a"));

        // Tìm link file zip đầu tiên trong danh sách
        const zipLink = links.find(a => {
          const href = a.getAttribute("href") || "";
          return href.toLowerCase().endsWith(".zip") && !href.startsWith("../");
        });

        if (zipLink) {
          const rawHref = zipLink.getAttribute("href");
          const cleanName = decodeURIComponent(rawHref.split("/").pop());
          setFileData(cleanName, `./files/${cleanName}`);
          return true;
        }
      }
    } catch (e) {
      // Bỏ qua nếu chạy file:// bị chặn CORS
    }

    // 3. Kiểm tra danh sách file từ files.js (cho môi trường offline / local)
    if (Array.isArray(window.FOLDER_FILES) && window.FOLDER_FILES.length > 0) {
      const offlineFile = window.FOLDER_FILES[0];
      setFileData(offlineFile, `./files/${offlineFile}`);
      return true;
    }

    // 4. Nếu không có dữ liệu nào đọc được
    if (fileNameEl && fileNameEl.textContent === "Đang quét tệp...") {
      fileNameEl.textContent = "Không tìm thấy file nào trong thư mục files";
      if (downloadLink) {
        downloadLink.classList.add("disabled");
      }
    }
    return false;
  }

  // Khởi chạy quét file tự động
  await detectFirstFile();

  // Nút tải xuống
  if (downloadLink) {
    downloadLink.addEventListener("click", (e) => {
      if (downloadLink.classList.contains("disabled")) {
        e.preventDefault();
        alert("Chưa tìm thấy file trong thư mục files. Hãy kiểm tra lại file đã up lên chưa!");
        return;
      }
      const span = downloadLink.querySelector("span");
      if (span) {
        const originalText = span.textContent;
        span.textContent = "Đang bắt đầu tải...";
        setTimeout(() => {
          span.textContent = originalText;
        }, 2500);
      }
    });
  }

  // Nút đăng xuất
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("access_authorized");
      sessionStorage.removeItem("auth_time");
      window.location.replace("./index.html");
    });
  }
});
