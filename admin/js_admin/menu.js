const backend_api = "http://127.0.0.1:8000";
let editMenuId = null;
let allMenuItems = [];

async function loadCategories() {
    const res = await fetch(`${backend_api}/categories/`);
    const categories = await res.json();
    const select = document.getElementById("item_category");
    select.innerHTML = "";
    categories.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

async function loadAllMenu() {
    const res = await fetch(`${backend_api}/menu/`);
    allMenuItems = await res.json();
    filterAndRenderMenu();
}

function filterAndRenderMenu() {
    const selectedCategory = document.getElementById("category-filter").value
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    const filtered = allMenuItems.filter(item => {
        if (selectedCategory === "all") return true;

        const category_name = item.category?.name?.toLowerCase() || "";
        if (selectedCategory === "starter" && category_name.includes("starter")) return true;
        if (selectedCategory === "main" && category_name.includes("main course")) return true;
        if (selectedCategory === "dessert" && category_name.includes("dessert")) return true;
        if (selectedCategory === "beverages" && category_name.includes("beverage")) return true;
        return false;
    })



    filtered.forEach(b => {
        tbody.innerHTML += `
        <tr>
            <td>${b.id}</td>
            <td>${b.name ?? "-"}</td>
            <td>${b.description ?? "-"}</td>
            <td>${b.price ?? "-"}</td>
            <td>${b.image_url ? `<img src="${backend_api}${b.image_url}" alt="${b.image_url}" style=" max-width: 100px; max-height:100px; object-fit:cover; border-radius: 4px;">` : "-"}</td>
            <td>${b.is_available ? "Available" : "Unavailable"}</td>
            <td>${b.is_featured ? "Featured" : "Not Featured"}</td>
            <td>${b.category?.name ?? b.category_id ?? "-"}</td>
            <td class="text-center">
            <button class="btn btn-sm btn-primary edit-btn" onclick="editMenu(${b.id})"><i class="fa fa-edit"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteMenu(${b.id})"><i class="fa fa-trash"></i></button></td>
        </tr>
        
        `
    });
}

document.getElementById("saveBannerBtn").addEventListener("click", async () => {
    const formData = new FormData();
    formData.append("name", document.getElementById("item_name").value);
    formData.append("description", document.getElementById("item_description").value);
    formData.append("price", document.getElementById("item_price").value);
    formData.append("is_featured", document.getElementById("item_featured").value);

    const isAvailable = document.getElementById("item_status").value === "available";
    formData.append("is_available", isAvailable ? "true" : "false");


    formData.append("category_id", document.getElementById("item_category").value);

    const imageFile = document.getElementById("item_images").files[0];
    if (imageFile) formData.append("image", imageFile);

    const url = editMenuId ? `${backend_api}/menu/${editMenuId}` : `${backend_api}/menu/`;
    const method = editMenuId ? "PUT" : "POST";

    const res = await fetch(url, {
        method: method,
        body: formData
    });

    if (res.ok) {
        $('#addMenuItemModal').modal('hide');
        loadAllMenu();
    } else {
        alert("Failed to save menu item");
        console.error(await res.json());
    }


});

async function editMenu(id) {
    editMenuId = id;
    const res = await fetch(`${backend_api}/menu/${id}`);
    if (res.ok) {
        const menu = await res.json();
        document.getElementById("item_name").value = menu.name ?? "";
        document.getElementById("item_description").value = menu.description ?? "";
        document.getElementById("item_price").value = menu.price ?? "";
        document.getElementById("item_status").value = menu.is_available ? "available" : "unavailable";
        document.getElementById("item_featured").value = menu.is_featured ? "true" : "false";
        document.getElementById("item_category").value = menu.category_id ?? "-";

        document.getElementById("item_images").value = "";
        document.getElementById("saveBannerBtn").innerHTML = "Update Item";

        $('#addMenuItemModal').modal('show');
    } else {
        alert("Failed to fetch item details.");
    }
}
async function deleteMenu(id) {
    if (!confirm("Delete this item")) return;
    const res = await fetch(`${backend_api}/menu/${id}`, {
        method: "DELETE"
    });
    if (res.ok) {
        loadAllMenu();
    } else {
        alert("Failed to delete banner. Check the console");
        console.error(await res.json());
    }
}

$('#addMenuItemModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    if (event.relatedTarget && !button.hasClass('edit-btn')) {
        editMenuId = null;

        document.getElementById("item_featured").value = "false"
        document.getElementById("exampleModalLongTitle").textContent = "Add Item";
        document.getElementById("saveBannerBtn").innerHTML = "Save";
    }
})
function init() {
    loadAllMenu();
    loadCategories();
    const filter = document.getElementById("category-filter");
    if (filter) {
        filter.addEventListener("change", filterAndRenderMenu);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
