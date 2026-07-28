const works = [
  {
    id: 1,
    title: "女子高生",
    cover: "assets/work-1.svg",
    categories: ["original", "deformed", "painted"],
    categoryLabel: "オリジナル",
    description: "デフォルメ女子高生フィギュアです。完成品写真、背面、3Dモデル、分割、仮組み、サフまで制作工程をまとめています。",
    height: "約120mm",
    material: "光造形レジン",
    year: "2026",
    images: [
      "assets/detail-1.svg",
      "assets/detail-2.svg",
      "assets/detail-3.svg",
      "assets/detail-4.svg",
      "assets/detail-5.svg",
      "assets/detail-6.svg"
    ],
    imageLabels: ["正面", "背面", "3Dモデル", "分割", "仮組み", "サフ"],
    timeline: [
      ["2026.07.01", "モデリング完了"],
      ["2026.07.03", "分割完了"],
      ["2026.07.05", "出力完了"],
      ["2026.07.08", "仮組み完了"],
      ["2026.07.10", "サフ完了"],
      ["2026.07.12", "完成"]
    ]
  },
  {
    id: 2,
    title: "レイズ",
    cover: "assets/work-2.svg",
    categories: ["original", "deformed", "prototype"],
    categoryLabel: "オリジナル",
    description: "制作中のオリジナルキャラクターです。現在は表面処理工程です。",
    height: "約130mm",
    material: "光造形レジン",
    year: "2026",
    images: ["assets/work-2.svg", "assets/detail-3.svg", "assets/detail-4.svg", "assets/detail-5.svg"],
    imageLabels: ["トップ", "3Dモデル", "分割", "仮組み"],
    timeline: [
      ["2026.07.18", "モデリング完了"],
      ["2026.07.21", "分割完了"],
      ["2026.07.24", "出力完了"],
      ["2026.07.27", "仮組み完了"]
    ]
  },
  {
    id: 3,
    title: "小悪魔",
    cover: "assets/work-3.svg",
    categories: ["fanart", "deformed", "painted"],
    categoryLabel: "二次創作",
    description: "イベント展示用に制作したデフォルメフィギュアです。",
    height: "約150mm",
    material: "光造形レジン",
    year: "2026",
    images: ["assets/work-3.svg", "assets/detail-2.svg", "assets/detail-3.svg"],
    imageLabels: ["トップ", "背面", "3Dモデル"],
    timeline: [["2026.05.10", "モデリング完了"], ["2026.05.21", "完成"]]
  },
  {
    id: 4,
    title: "犬",
    cover: "assets/work-4.svg",
    categories: ["original", "deformed", "prototype"],
    categoryLabel: "オリジナル",
    description: "飼い主を待つ姿をテーマにした小型フィギュアです。",
    height: "約90mm",
    material: "PLA / 石粉粘土",
    year: "2026",
    images: ["assets/work-4.svg", "assets/detail-6.svg"],
    imageLabels: ["トップ", "サフ"],
    timeline: [["2026.04.01", "造形開始"], ["2026.04.12", "完成"]]
  },
  {
    id: 5,
    title: "ジャージ娘",
    cover: "assets/work-5.svg",
    categories: ["original", "scale", "painted"],
    categoryLabel: "オリジナル",
    description: "12cmサイズで制作した等身寄りのオリジナル作品です。",
    height: "約120mm",
    material: "PLA",
    year: "2026",
    images: ["assets/work-5.svg", "assets/detail-4.svg"],
    imageLabels: ["トップ", "分割"],
    timeline: [["2026.03.02", "モデリング完了"], ["2026.03.16", "完成"]]
  },
  {
    id: 6,
    title: "インキュバス",
    cover: "assets/work-6.svg",
    categories: ["fanart", "deformed", "prototype"],
    categoryLabel: "二次創作",
    description: "ワンダーフェスティバル向けに制作した作品です。",
    height: "約150mm",
    material: "光造形レジン",
    year: "2026",
    images: ["assets/work-6.svg", "assets/detail-5.svg", "assets/detail-6.svg"],
    imageLabels: ["トップ", "仮組み", "サフ"],
    timeline: [["2026.06.20", "出力完了"], ["2026.07.12", "完成"]]
  }
];

const perPage = 6;
let activeFilter = "all";
let currentPage = 1;
let activeWork = null;
let activeImageIndex = 0;

const grid = document.getElementById("worksGrid");
const pageNumbers = document.getElementById("pageNumbers");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const modal = document.getElementById("workModal");
const modalMainImage = document.getElementById("modalMainImage");
const thumbnailRow = document.getElementById("thumbnailRow");
const imageIndicators = document.getElementById("imageIndicators");

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
    <button class="work-card" type="button" data-open-work="${work.id}" aria-label="${work.title}の詳細を見る">
      <img src="${work.cover}" alt="${work.title}のトップ画像">
      <h3>${work.title}</h3>
      <div class="meta">
        <span>${work.categoryLabel}</span>
        <span>${work.year}</span>
      </div>
    </button>
  `).join("");

  pageNumbers.innerHTML = Array.from({length: pageCount}, (_, index) => {
    const page = index + 1;
    return `<button type="button" data-page="${page}" class="${page === currentPage ? "is-current" : ""}" aria-label="${page}ページ">${page}</button>`;
  }).join("");

  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === pageCount;
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
  document.getElementById("modalTimeline").innerHTML = activeWork.timeline.map(([date, label]) =>
    `<li><time>${date}</time>${label}</li>`
  ).join("");

  renderModalImage();
  if (!modal.open) modal.showModal();
}

function renderModalImage() {
  const image = activeWork.images[activeImageIndex];
  const label = activeWork.imageLabels[activeImageIndex] || `${activeWork.title} ${activeImageIndex + 1}`;
  modalMainImage.src = image;
  modalMainImage.alt = `${activeWork.title}：${label}`;

  thumbnailRow.innerHTML = activeWork.images.map((src, index) => `
    <button type="button" data-image-index="${index}" class="${index === activeImageIndex ? "is-active" : ""}" aria-label="${activeWork.imageLabels[index] || index + 1}を表示">
      <img src="${src}" alt="">
    </button>
  `).join("");

  imageIndicators.innerHTML = activeWork.images.map((_, index) =>
    `<span class="${index === activeImageIndex ? "is-active" : ""}" aria-hidden="true"></span>`
  ).join("");
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
    document.getElementById("works-title").scrollIntoView({behavior: "smooth", block: "start"});
  }

  const thumbButton = event.target.closest("[data-image-index]");
  if (thumbButton) {
    activeImageIndex = Number(thumbButton.dataset.imageIndex);
    renderModalImage();
  }
});

prevPage.addEventListener("click", () => {
  if (currentPage > 1) { currentPage--; renderWorks(); }
});
nextPage.addEventListener("click", () => {
  const pages = Math.ceil(filteredWorks().length / perPage);
  if (currentPage < pages) { currentPage++; renderWorks(); }
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
