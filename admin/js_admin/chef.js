const backend_api = "http://127.0.0.1:8000";
let allChefs = [];
let editChefId = null;

async function getAllChef() {
    try {
        const res = await fetch(`${backend_api}/chefs/`);
        if (!res.ok) throw new Error("Failed to load chefs list");
        allChefs = await res.json();
        renderChefsTable();

    } catch (error) {
        console.error("Error fetching chefs:", error);
    }
}

function renderChefsTable() {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    allChefs.forEach(chef => {
        tbody.innerHTML += `
        <tr>
            <td>${chef.id}</td>
            <td>${chef.name ?? "--"}</td>
            <td>${chef.specialty ?? "--"}</td>
            <td>${chef.description ?? "--"}</td>
            <td>${chef.photo_url ? `<img src="${backend_api}${chef.photo_url}" alt="${chef.name}" style="width:100px;height:100px">` : "--"}</td>
            <td>${chef.display_order}</td>
            <td>${chef.is_active ? "Available" : "Not Available"}</td>
            <td class="text-center">
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="headChefSwitch${chef.id}" 
                        ${chef.is_head_chef ? 'checked' : ''} 
                        onchange="toggleHeadChef(${chef.id}, this.checked)">
                    <label class="custom-control-label" for="headChefSwitch${chef.id}"></label>
                </div>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-primary edit-btn" onclick="editChef(${chef.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteChef(${chef.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });
}

async function toggleHeadChef(chefId, isChecked) {
    const formData = new FormData();
    formData.append("head_chef", isChecked ? "true" : "false");

    try {
        const res = await fetch(`${backend_api}/chefs/${chefId}`, {
            method: "PUT",
            body: formData
        });

        console.log("Toggle response status:", res.status);
        const data = await res.json();
        console.log("Toggle response data:", data);

        if (res.ok) {
            getAllChef();
        } else {
            alert("Failed to update Head Chef: " + JSON.stringify(data));
        }
    } catch (err) {
        console.error("Toggle error:", err);
    }
}
async function editChef(id) {
    editChefId = id;
    const res = await fetch(`${backend_api}/chefs/${id}`);
    const chef = await res.json();

    $("#chef_name").val(chef.name);
    $("#specialty").val(chef.specialty);
    $("#chef_description").val(chef.description);
    $("#chef_status").val(chef.is_active ? "available" : "unavailable");
    $("#display_order").val(chef.display_order ?? 0);
    $("#exampleModalLongTitle").text("Update Chef");
    $("#saveBannerBtn").text("Update Chef");
    $("#addChefModal").modal("show");
}

async function deleteChef(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`${backend_api}/chefs/${id}`, { method: "DELETE" });
    getAllChef();
}

$("#saveBannerBtn").click(async () => {
    const formData = new FormData();
    formData.append("name", $("#chef_name").val());
    formData.append("specialty", $("#specialty").val());
    formData.append("description", $("#chef_description").val());
    formData.append("status", $("#chef_status").val() === "available" ? "true" : "false");
    formData.append("display_order", $("#display_order").val());

    const image = $(`#chef_images`)[0].files[0];
    if (image) formData.append("image", image);

    const url = editChefId ? `${backend_api}/chefs/${editChefId}` : `${backend_api}/chefs/`;
    await fetch(url, { method: editChefId ? "PUT" : "POST", body: formData });

    $("#addChefModal").modal("hide");
    getAllChef();

});

$("#addChefModal").on("shown.bs.modal", function (event) {
    const button = $(event.relatedTarget);
    if (event.relatedTarget && !button.hasClass("edit-btn")) {
        editChefId = null;
        $(".new-banner-form")[0].reset();
        $("#exampleModalLongTitle").text("Add New Chef");
        $("#saveBannerBtn").text("Save");
    }
})

$(document).ready(() => getAllChef());
