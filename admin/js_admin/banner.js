const backend_api = "http://127.0.0.1:8000";
let editBannerId = null;

async function loadBanners() {
    const res = await fetch(`${backend_api}/banners`);
    const banners = await res.json();
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";
    banners.forEach(b => {
        tbody.innerHTML += `
        <tr>
            <td>${b.id}</td>
            <td >${b.title ?? "-"}</td>
            <td>${b.subtitle ?? "-"}</td>
            <td>${b.description ?? "-"}</td>
            <td>${b.image_url ? `<img src="${backend_api}${b.image_url}" alt="${b.image_url}" style=" max-width: 100px; max-height:100px; object-fit:cover; border-radius: 4px;">` : "-"}</td>
            <td>${b.status ? "Published" : "Unpublished"}</td>
            <td class="text-center">
            <button class="btn btn-sm btn-primary edit-btn" onclick="editBanner(${b.id})"><i class="fa fa-edit"></i></button>
            </td>
            <td class="text-center">
            <button class="btn btn-sm btn-danger" onclick="deleteBanner(${b.id})"><i class="fa fa-trash"></i></button>
            </td>
            </tr>
        `

    });

}

document.getElementById("saveBannerBtn").addEventListener("click", async () => {
    const formData = new FormData();
    formData.append("title", document.getElementById("banner_title").value);
    formData.append("subtitle", document.getElementById("banner_subtitle").value);
    formData.append("description", document.getElementById("banner_description").value);
    formData.append("status", document.getElementById("banner_status").value === "published");

    const imageFile = document.getElementById("banner_image").files[0];
    if (imageFile) formData.append("image", imageFile);

    const url = editBannerId ? `${backend_api}/banners/${editBannerId}` : `${backend_api}/banners/`;
    const method = editBannerId ? "PUT" : "POST";

    const res = await fetch(url, {
        method: method,
        body: formData
    });

    if (res.ok) {
        $('#addBannerModal').modal('hide');
        loadBanners();
    } else {
        alert("Failed to save banner. Check the console");
        console.error(await res.json());
    }
});

async function editBanner(id) {
    editBannerId = id;
    const res = await fetch(`${backend_api}/banners/${id}`);
    if (res.ok) {
        const banner = await res.json();
        document.getElementById("banner_title").value = banner.title ?? "";
        document.getElementById("banner_subtitle").value = banner.subtitle ?? "";
        document.getElementById("banner_description").value = banner.description ?? "";
        document.getElementById("banner_status").value = banner.status ? "published" : "unpublished";

        document.getElementById("banner_image").value = "";
        document.getElementById("saveBannerBtn").innerHTML = "Update Banner";

        $('#addBannerModal').modal('show');
    } else {
        alert("Failed to fetch banner details.");
    }
}
async function deleteBanner(id) {
    if (!confirm("Delete this banner")) return;
    const res = await fetch(`${backend_api}/banners/${id}`, {
        method: "DELETE"
    });
    if (res.ok) {
        loadBanners();
    } else {
        alert("Failed to delete banner. Check the console");
        console.error(await res.json());
    }
}

$('#addBannerModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    if (event.relatedTarget && !button.hasClass('edit-btn')) {
        editBannerId = null;

        document.getElementById("exampleModalLongTitle").textContent = "Add Banner";
        document.getElementById("saveBannerBtn").innerHTML = "Save";
    }
})
document.addEventListener("DOMContentLoaded", loadBanners);
