const getMenu = "http://127.0.0.1:8000/menu/";

async function fetchMenu() {
    const container = document.getElementById("modalMenuContainer");
    try {
        const res = await fetch(getMenu);
        if (!res.ok) {
            throw new Error("Failed to fetch menu");
        }
        const data = await res.json();

        container.innerHTML = "";
        data.filter(item => item.is_available).forEach(item => {
            const catName = (item.category && item.category.name) ? item.category.name.toLowerCase() : "";
            let filterClass = "";
            if (catName.includes("starter")) filterClass = "starters";
            else if (catName.includes("main")) filterClass = "main-course";
            else if (catName.includes("dessert") || catName.includes("desert")) filterClass = "desserts";
            else if (catName.includes("beverage") || catName.includes("drink")) filterClass = "beverages";

            const imageUrl = item.image_url ? `http://127.0.0.1:8000${item.image_url}` : 'images/item-1.jpg';

            container.innerHTML += `
                <div class="col-md-4 menu-item-modal" data-category="${filterClass}" data-name="${item.name.toLowerCase()}">
                            <div class="modal-menu-card">
                                <img src="${imageUrl}" alt="${item.name.toLowerCase()}"
                                    style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                                <div class="menu-card-content mt-2">
                                    <h5 class="modal-menu-card-title">${item.name}</h5>
                                    <span class="modal-menu-card-price">${item.price.toFixed(2)}</span>
                                    <div class="qty-adjuster mt-2 d-flex align-items-center gap-2">
                                        <button class="btn-minus" type="button" onclick="decrement(this)">-</button>
                                        <input type="text" value="0" class="qtyInput" readonly
                                            style="width: 20px; text-align: center;">
                                        <button class="btn-plus" type="button" onclick="increment(this)">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>`



        });

    }
    catch (err) {
        console.error("Modal menu load failed.");
        container.innerHTML = "<p class=\"text-danger\">Failed to load menu items.</p>";
    }

}


function increment(button) {
    const qty = button.parentElement.querySelector(".qtyInput");

    if (qty) {
        qty.value = parseInt(qty.value) + 1;
    }
}

function decrement(button) {
    const qty = button.parentElement.querySelector(".qtyInput");

    if (qty) {
        let currentVal = parseInt(qty.value) || 0;
        qty.value = currentVal > 0 ? currentVal - 1 : 0;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const modalFilterTabs = document.querySelectorAll("#modalFilterTabs .filter-tab");
    const modalSearchInput = document.querySelector("#modalSearchInput");

    let activeFilter = 'all';
    let searchQuery = '';

    function filterMenu() {
        const modalMenuItems = document.querySelectorAll("#modalMenuContainer .menu-item-modal");
        modalMenuItems.forEach(item => {
            const itemName = (item.getAttribute('data-name') || '').toLowerCase();
            const itemCategory = item.getAttribute('data-category') || '';
            const matchesCategory = (activeFilter === 'all' || itemCategory === activeFilter);
            const matchesSearch = itemName.includes(searchQuery);
            item.style.display = (matchesCategory && matchesSearch) ? "block" : "none";
        });
    }

    modalFilterTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            modalFilterTabs.forEach(t => t.classList.remove("active"));
            this.classList.add('active');
            activeFilter = this.getAttribute('data-filter');
            filterMenu();
        });
    });

    if (modalSearchInput) {
        modalSearchInput.addEventListener("input", function () {
            searchQuery = this.value.toLowerCase().trim();
            filterMenu();
        });
    }

    window.selectedMenuItems = [];

    const saveBtn = document.getElementById("saveBookingMenuSelectionsBtn");
    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            const allCards = document.querySelectorAll("#modalMenuContainer .menu-item-modal");
            const selections = [];
            allCards.forEach(card => {
                const qtyInput = card.querySelector(".qtyInput");
                const qty = parseInt(qtyInput ? qtyInput.value : 0);

                if (qty > 0) {
                    const name = card.querySelector(".modal-menu-card-title").textContent;
                    const priceElem = card.querySelector(".modal-menu-card-price");
                    const price = priceElem ? priceElem.textContent : "";
                    selections.push({ name, qty, price });

                }
            });
            window.selectedMenuItems = selections;

            const opentBtn = document.getElementById("openMenuModalBtn");
            if (opentBtn) {
                const total = selections.reduce((sum, s) => sum + s.qty, 0);
                opentBtn.innerHTML = total > 0 ? `<i class="bi bi-check-circle"></i> ${total} item(s) selected` : `<i class="bi bi-plus"></i> Add Menu Item`;
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById("bookingMenuModal"));
            if (modal) modal.hide();
        });
    }
});

fetchMenu();
