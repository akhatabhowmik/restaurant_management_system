const menuAPI = "http://127.0.0.1:8000";

async function loadUserMenu() {
    console.log("loadUserMenu: Starting menu loading...");
    try {
        const res = await fetch(`${menuAPI}/menu/`);
        console.log("loadUserMenu: Fetch response status:", res.status);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const menuItems = await res.json();
        console.log("loadUserMenu: Retrieved menu items count:", menuItems.length, menuItems);

        const container = document.getElementById("menuContainer");
        if (!container) {
            console.error("loadUserMenu: Container with id 'menuContainer' not found in DOM!");
            return;
        }

        // Clear container (removes static placeholders and info-strip if any)
        container.innerHTML = "";

        // Only render items where is_available is true
        const availableItems = menuItems.filter(item => item.is_available);
        console.log("loadUserMenu: Available menu items count:", availableItems.length);

        if (availableItems.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>No menu items available at the moment.</p></div>`;
            return;
        }

        availableItems.forEach(item => {
            console.log("loadUserMenu: Rendering item:", item.name);
            // Bulletproof category property retrieval
            const catName = (item.category && item.category.name) ? item.category.name.toLowerCase() : "";
            let filterClass = "";
            if (catName.includes("starter")) filterClass = "starters";
            else if (catName.includes("main")) filterClass = "main-course";
            else if (catName.includes("dessert") || catName.includes("desert")) filterClass = "desserts";
            else if (catName.includes("beverage") || catName.includes("drink")) filterClass = "beverages";

            // Fallback placeholder image if no image was uploaded
            const imageUrl = item.image_url ? `${menuAPI}${item.image_url}` : 'images/item-1.jpg';

            container.innerHTML += `
            <div class="col-lg-6 mb-4 menu-item ${filterClass}">
                <div class="menu-item-wrapper d-flex align-items-center">
                    <div class="menu-item-image me-3">
                        <img src="${imageUrl}" alt="${item.name}" class="img-fluid rounded" style="width: 80px; height: 80px; object-fit: cover;">
                    </div>
                    <div class="menu-item-info flex-grow-1">
                        <div class="menu-item-header d-flex justify-content-between align-items-baseline">
                            <h5 class="menu-item-title fw-bold mb-3">${item.name}</h5>
                            <span class="menu-item-price fw-bold">$${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                        <p class="menu-item-description">${item.description ?? ""}</p>
                    </div>
                </div>
            </div>`;
        });

        const specialsContainer = document.getElementById("specialsContainer");
        if (specialsContainer) {
            specialsContainer.innerHTML = "";
            const specials = menuItems.filter(item => item.is_featured && item.is_available);
            if (specials.length === 0) {
                specialsContainer.innerHTML = '<div class="col-12 text-center text-muted"><p>Check back later for kitchen highlights!</p></div>';
            }
            else {
                specials.forEach(item => {
                    const image_url = item.image_url ? `${menuAPI}${item.image_url}` : 'images/item-1.jpg';
                    specialsContainer.innerHTML += `<div class="col-lg-6">
                                    <div class="spotlight-card">
                                        <div class="row g-0">
                                            <div class="col-5">
                                                <div class="position-relative">
                                                    <img src="${image_url}" alt="${item.name}"
                                                        class="img-fluid rounded-3 " style="height: 200px; width: 250px;">
                                                    <span class="pick-badge"><i class="bi bi-trophy"></i></span>
                                                </div>
                                            </div>
                                            <div class="col-7">
                                                <div class="spotlight-body">
                                                    <h4>${item.name}</h4>
                                                    <p>${item.description ?? ""}</p>
                                                    <div class="spotlight-footer">
                                                        <span class="spotlight-price">$${parseFloat(item.price).toFixed(2)}</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>`
                });
            }
        }
        console.log("loadUserMenu: Completed rendering menu items successfully.");
    } catch (err) {
        console.error("loadUserMenu: Critical error loading menu:", err);
    }


}



if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadUserMenu);
} else {
    loadUserMenu();
}
