const chefAPI = "http://127.0.0.1:8000";

async function loadChefs() {
    const res = await fetch(`${chefAPI}/chefs/`);
    const allChefs = await res.json();

    const crew_card = document.querySelector(".crew-cards");

    crew_card.innerHTML = "";

    const available_chefs = allChefs.filter(chef => chef.is_active);
    available_chefs.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const head_chef_filtered = allChefs.filter(chef => chef.is_head_chef);

    if (available_chefs.length === 0) {
        crew_card.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>No chefs available at the moment.</p></div>`;
        return;
    }

    available_chefs.forEach(chef => {
        image_url = `${chefAPI}${chef.photo_url}`;

        if (!chef.is_head_chef) {
            crew_card.innerHTML += `
            <div class="col-md-6">
                <article class="crew-member">
                    <div class="row g-0 align-items-center">
                        <div class="col-4">
                        <div class="crew-photo">
                            <img src="${image_url}" alt="${chef.name}" class="img-fluid">
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="member-info">
                            <h4 class="member-name">${chef.name}</h4>
                            <p class="member-role">Sous Chef</p>
                            <p class="member-description">${chef.description}</p>
                            <div class="member-footer">
                            <span class="skill-tag">
                            <i class="bi bi-award me-1"></i> ${chef.specialty}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>`;
        }
    });

    const head_chef = document.querySelector(".head-chef");
    head_chef.innerHTML = "";

    head_chef_filtered.forEach(chef => {
        image_url = `${chefAPI}${chef.photo_url}`;
        head_chef.innerHTML += `
        <div class="col-lg-6">
                        <div class="spotlight-image">
                            <img src="${image_url}" alt="${chef.name}" class="img-fluid">
                            <div class="accent-tag">
                                <i class="bi bi-star-fill me-1"></i> Award Recipient
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="spotlight-details me-4">
                            <h3 class="chef-title">${chef.name}</h3>
                            <p class="chef-details">${chef.specialty}</p>
                            <p class="chef-summary">${chef.description}</p>
                            <ul class="list-unstyled">
                                <li>
                                    <i class="bi bi-award-fill"></i> International Cuisine Prize 2023
                                </li>
                                <li>
                                    <i class="bi bi-bookmark-star-fill"></i> Academy of Gastronomy Fellow
                                </li>
                                <li>
                                    <i class="bi bi-trophy-fill"></i> Regional Tasting Championship
                                </li>
                            </ul>
                        </div>
                    </div>`
    })







}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadChefs);
} else {
    loadChefs();
}
