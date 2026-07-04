const API = "http://127.0.0.1:8000";

async function loadHeroBanners() {
    const res = await fetch(`${API}/banners/`);
    const banners = await res.json();

    const active = banners.filter(b => b.status === true);

    const inner = document.getElementById("heroBannerInner");
    inner.innerHTML = "";

    if (active.length === 0) {
        inner.innerHTML = `
        <div class="carousel-item active">
            <img src="images/rest-1.jpg" class="d-block w-100" alt="Default">
        </div>`;
        return;
    }

    active.forEach((b, i) => {
        inner.innerHTML += `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
            <img src="${API}${b.image_url}" class="d-block w-100" alt="${b.title ?? "Banner"}">
            <div class="container position-absolute top-50 start-50 translate-middle h-100 d-flex align-items-center" style="z-index: 2; pointer-events: none; margin-top: 10px">
                <div class="hero-grid w-100" style="pointer-events: auto;">
                    <div class="card bg-transparent border-0 text-white p-0">
                        <div class="card-body">
                            <span class="hero-tag">${b.subtitle ?? ""}</span>
                            <h1 class="card-title">${b.title ?? ""}</h1>
                            <p class="card-text">${b.description ?? ""}</p>
                            <div class="hero-actions d-flex gap-3 mt-5">
                                <a href="#menu" class="btn btn-brand">${"Our Menu"}</a>
                                <a href="#book-a-table" class="btn btn-outline-light">${"Book A Table"}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

document.addEventListener("DOMContentLoaded", loadHeroBanners);
