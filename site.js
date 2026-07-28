(() => {
  "use strict";

  const DATA_PATHS = {
    works: "data/works.json",
    news: "data/news.json",
    guestbook: "data/guestbook.json"
  };

  const CONTACT_EMAIL = "sentakubiyori01@gmail.com";

  async function loadJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${path} を読み込めませんでした（${response.status}）`);
    }
    return response.json();
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderLoadError(element, error) {
    if (!element) return;
    element.innerHTML = `<p class="load-error">データを読み込めませんでした。ページを再読み込みしてください。<br><small>${escapeHtml(error.message)}</small></p>`;
  }

  async function renderNews() {
    const homeList = document.getElementById("homeNewsList");
    const archive = document.getElementById("newsArchive");
    if (!homeList && !archive) return;

    try {
      const news = await loadJson(DATA_PATHS.news);
      const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));

      if (homeList) {
        homeList.innerHTML = sorted.slice(0, 4).map(item => `
          <li>
            <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.displayDate || item.date)}</time>
            <span>${escapeHtml(item.title)}</span>
          </li>
        `).join("");
      }

      if (archive) {
        const perPage = 10;
        let currentPage = 1;
        const prevButton = document.getElementById("newsPrev");
        const nextButton = document.getElementById("newsNext");
        const pageNumbers = document.getElementById("newsPageNumbers");

        const renderArchivePage = () => {
          const pageCount = Math.max(1, Math.ceil(sorted.length / perPage));
          currentPage = Math.min(currentPage, pageCount);

          const start = (currentPage - 1) * perPage;
          archive.innerHTML = sorted
            .slice(start, start + perPage)
            .map(item => `
              <article class="archive-entry">
                <header>
                  <h2>${escapeHtml(item.title)}</h2>
                  <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.displayDate || item.date)}</time>
                </header>
                <p>${escapeHtml(item.body)}</p>
                ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.title)}">` : ""}
                ${item.category ? `<p class="entry-meta">カテゴリ：${escapeHtml(item.category)}</p>` : ""}
              </article>
            `)
            .join("");

          if (pageNumbers) {
            pageNumbers.innerHTML = Array.from({ length: pageCount }, (_, index) => {
              const page = index + 1;
              return `<button type="button" data-news-page="${page}" class="${page === currentPage ? "is-current" : ""}" aria-label="${page}ページ">${page}</button>`;
            }).join("");
          }

          if (prevButton) prevButton.disabled = currentPage === 1;
          if (nextButton) nextButton.disabled = currentPage === pageCount;
        };

        if (prevButton) {
          prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
              currentPage--;
              renderArchivePage();
              archive.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        }

        if (nextButton) {
          nextButton.addEventListener("click", () => {
            const pageCount = Math.max(1, Math.ceil(sorted.length / perPage));
            if (currentPage < pageCount) {
              currentPage++;
              renderArchivePage();
              archive.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        }

        if (pageNumbers) {
          pageNumbers.addEventListener("click", event => {
            const button = event.target.closest("[data-news-page]");
            if (!button) return;
            currentPage = Number(button.dataset.newsPage);
            renderArchivePage();
            archive.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }

        renderArchivePage();
      }
    } catch (error) {
      renderLoadError(homeList || archive, error);
    }
  }

  async function renderGuestbook() {
    const homeList = document.getElementById("homeGuestbookList");
    const archive = document.getElementById("guestbookArchive");
    if (!homeList && !archive) return;

    try {
      const entries = await loadJson(DATA_PATHS.guestbook);
      const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

      const card = (entry, compact = false) => `
        <article class="${compact ? "" : "guestbook-entry"}">
          ${compact ? `
            <p>${escapeHtml(entry.message)}</p>
            <footer>— ${escapeHtml(entry.displayDate || entry.date)}　${escapeHtml(entry.name)}</footer>
            <div class="reply-box">
              <strong>お返事</strong>
              <p>${escapeHtml(entry.reply)}</p>
            </div>
          ` : `
            <div class="guestbook-message">
              <header>
                <h3>${escapeHtml(entry.name)}</h3>
                <time datetime="${escapeHtml(entry.date)}">${escapeHtml(entry.displayDate || entry.date)}</time>
              </header>
              <p>${escapeHtml(entry.message)}</p>
            </div>
            <div class="guestbook-reply">
              <strong>お返事</strong>
              <p>${escapeHtml(entry.reply)}</p>
            </div>
          `}
        </article>
      `;

      if (homeList) {
        homeList.innerHTML = sorted.slice(0, 2).map(entry => card(entry, true)).join("");
      }

      if (archive) {
        const perPage = 10;
        let currentPage = 1;
        const prevButton = document.getElementById("guestbookPrev");
        const nextButton = document.getElementById("guestbookNext");
        const pageNumbers = document.getElementById("guestbookPageNumbers");

        const renderArchivePage = () => {
          const pageCount = Math.max(1, Math.ceil(sorted.length / perPage));
          currentPage = Math.min(currentPage, pageCount);

          const start = (currentPage - 1) * perPage;
          archive.innerHTML = sorted
            .slice(start, start + perPage)
            .map(entry => card(entry, false))
            .join("");

          if (pageNumbers) {
            pageNumbers.innerHTML = Array.from({ length: pageCount }, (_, index) => {
              const page = index + 1;
              return `<button type="button" data-guestbook-page="${page}" class="${page === currentPage ? "is-current" : ""}" aria-label="${page}ページ">${page}</button>`;
            }).join("");
          }

          if (prevButton) prevButton.disabled = currentPage === 1;
          if (nextButton) nextButton.disabled = currentPage === pageCount;
        };

        if (prevButton) {
          prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
              currentPage--;
              renderArchivePage();
              archive.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        }

        if (nextButton) {
          nextButton.addEventListener("click", () => {
            const pageCount = Math.max(1, Math.ceil(sorted.length / perPage));
            if (currentPage < pageCount) {
              currentPage++;
              renderArchivePage();
              archive.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        }

        if (pageNumbers) {
          pageNumbers.addEventListener("click", event => {
            const button = event.target.closest("[data-guestbook-page]");
            if (!button) return;
            currentPage = Number(button.dataset.guestbookPage);
            renderArchivePage();
            archive.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }

        renderArchivePage();
      }
    } catch (error) {
      renderLoadError(homeList || archive, error);
    }
  }

  async function initWorks() {
    const grid = document.getElementById("worksGrid");
    if (!grid) return;

    const pageNumbers = document.getElementById("pageNumbers");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const modal = document.getElementById("workModal");
    const modalMainImage = document.getElementById("modalMainImage");
    const thumbnailRow = document.getElementById("thumbnailRow");
    const imageIndicators = document.getElementById("imageIndicators");

    let works = [];
    let activeFilter = "all";
    let currentPage = 1;
    let activeWork = null;
    let activeImageIndex = 0;
    const perPage = 8;

    try {
      works = await loadJson(DATA_PATHS.works);
    } catch (error) {
      renderLoadError(grid, error);
      return;
    }

    function filteredWorks() {
      return activeFilter === "all"
        ? works
        : works.filter(work => work.categories.includes(activeFilter));
    }

    function renderWorks() {
      const items = filteredWorks();
      const pageCount = Math.max(1, Math.ceil(items.length / perPage));
      currentPage = Math.min(currentPage, pageCount);
      const start = (currentPage - 1) * perPage;
      const visible = items.slice(start, start + perPage);

      grid.innerHTML = visible.map(work => `
        <button class="work-card" type="button" data-open-work="${work.id}" aria-label="${escapeHtml(work.title)}の詳細を見る">
          <img src="${escapeHtml(work.cover)}" alt="${escapeHtml(work.title)}のトップ画像">
          <h3>${escapeHtml(work.title)}</h3>
          <div class="meta">
            <span>${escapeHtml(work.categoryLabel)}</span>
            <span>${escapeHtml(work.year)}</span>
          </div>
        </button>
      `).join("");

      pageNumbers.innerHTML = Array.from({ length: pageCount }, (_, index) => {
        const page = index + 1;
        return `<button type="button" data-page="${page}" class="${page === currentPage ? "is-current" : ""}" aria-label="${page}ページ">${page}</button>`;
      }).join("");

      prevPage.disabled = currentPage === 1;
      nextPage.disabled = currentPage === pageCount;
    }

    function renderModalImage() {
      const image = activeWork.images[activeImageIndex];
      const label = activeWork.imageLabels[activeImageIndex] || `${activeWork.title} ${activeImageIndex + 1}`;
      modalMainImage.src = image;
      modalMainImage.alt = `${activeWork.title}：${label}`;

      thumbnailRow.innerHTML = activeWork.images.map((src, index) => `
        <button type="button" data-image-index="${index}" class="${index === activeImageIndex ? "is-active" : ""}" aria-label="${escapeHtml(activeWork.imageLabels[index] || index + 1)}を表示">
          <img src="${escapeHtml(src)}" alt="">
        </button>
      `).join("");

      imageIndicators.innerHTML = activeWork.images.map((_, index) =>
        `<span class="${index === activeImageIndex ? "is-active" : ""}" aria-hidden="true"></span>`
      ).join("");
    }

    function openWork(id) {
      activeWork = works.find(work => work.id === Number(id));
      if (!activeWork) return;
      activeImageIndex = 0;

      document.getElementById("modalTitle").textContent = activeWork.title;
      document.getElementById("modalCategory").textContent = activeWork.categoryLabel;
      document.getElementById("modalDescription").textContent = activeWork.description;
      document.getElementById("modalHeight").textContent = activeWork.height;
      document.getElementById("modalMaterial").textContent = activeWork.material;
      document.getElementById("modalYear").textContent = activeWork.year;
      document.getElementById("modalTimeline").innerHTML = activeWork.timeline.map(item =>
        `<li><time>${escapeHtml(item.date)}</time>${escapeHtml(item.label)}</li>`
      ).join("");

      renderModalImage();
      if (!modal.open) modal.showModal();
    }

    function moveImage(delta) {
      if (!activeWork) return;
      activeImageIndex = (activeImageIndex + delta + activeWork.images.length) % activeWork.images.length;
      renderModalImage();
    }

    document.addEventListener("click", event => {
      const openButton = event.target.closest("[data-open-work]");
      if (openButton) openWork(openButton.dataset.openWork);

      const filterButton = event.target.closest("[data-filter]");
      if (filterButton) {
        activeFilter = filterButton.dataset.filter;
        currentPage = 1;
        document.querySelectorAll("[data-filter]").forEach(button =>
          button.classList.toggle("is-active", button === filterButton)
        );
        renderWorks();
      }

      const pageButton = event.target.closest("[data-page]");
      if (pageButton) {
        currentPage = Number(pageButton.dataset.page);
        renderWorks();
        document.getElementById("works-title").scrollIntoView({ behavior: "smooth", block: "start" });
      }

      const thumbButton = event.target.closest("[data-image-index]");
      if (thumbButton) {
        activeImageIndex = Number(thumbButton.dataset.imageIndex);
        renderModalImage();
      }
    });

    prevPage.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderWorks();
      }
    });

    nextPage.addEventListener("click", () => {
      const pages = Math.ceil(filteredWorks().length / perPage);
      if (currentPage < pages) {
        currentPage++;
        renderWorks();
      }
    });

    document.getElementById("prevImage").addEventListener("click", () => moveImage(-1));
    document.getElementById("nextImage").addEventListener("click", () => moveImage(1));
    document.getElementById("closeModal").addEventListener("click", () => modal.close());

    modal.addEventListener("click", event => {
      if (event.target === modal) modal.close();
    });

    document.addEventListener("keydown", event => {
      if (!modal.open) return;
      if (event.key === "ArrowLeft") moveImage(-1);
      if (event.key === "ArrowRight") moveImage(1);
    });

    renderWorks();
  }


  document.addEventListener("DOMContentLoaded", () => {
    renderNews();
    renderGuestbook();
    initWorks();
  });
})();
