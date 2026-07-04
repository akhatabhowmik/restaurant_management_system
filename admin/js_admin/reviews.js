const api = "http://127.0.0.1:8000";
let editReviewId = [];

async function loadReviews() {
    const res = await fetch(`${api}/testimonials`);
    const testimonials = await res.json();

    tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";
    testimonials.forEach(t => {
        const reviewDate = t.review_date ? t.review_date.split("T")[0] : "N/A";
        tbody.innerHTML += `<tr>
        <td>${t.id}</td>
        <td>${t.name}</td>
        <td>${t.designation}</td>
        <td>${t.review}</td>
        <td>${reviewDate}</td>
        <td>${t.rating}</td>
        <td>${t.image_url ? `<img src="${api}${t.image_url}" alt="${t.name}" width="50">` : 'No Image'}</td>
        <td>${t.display_review ? "Yes" : "No"}</td>
        <td><button class="btn btn-primary" onclick="editReview(${t.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteReview(${t.id})">Delete</button>
        </td>
        </tr>`

    });

}

async function editReview(id) {
    editReviewId = id;
    const res = await fetch(`${api}/testimonials/${id}`);
    if (res.ok) {
        const review = await res.json();
        const date = review.review_date ? review.review_date.split("T")[0] : "N/A";
        document.getElementById("name").value = review.name;
        document.getElementById("designation").value = review.designation;
        document.getElementById("review").value = review.review;
        document.getElementById("rating").value = review.rating;
        document.getElementById("review_date").value = date;
        document.getElementById("display_review").value = review.display_review ? "true" : "false";
        const imageFile = document.getElementById("image_url").files[0];
        if (imageFile) formData.append("image", imageFile);
        $("#editReviewModal").modal("show");
    }
    else {
        alert("Failed to save changes");
    }

}

document.getElementById("saveBannerBtn").addEventListener("click", async () => {
    const display_review = document.getElementById("display_review");
    const formData = new FormData();
    formData.append("display_review", display_review.value);

    try {
        const res = await fetch(`${api}/testimonials/${editReviewId}`, {
            method: "PUT",
            body: formData
        })

        if (res.ok) {
            const review = await res.json();
            loadReviews();
            alert("Review Status Updated Successfully");
            $("#editReviewModal").modal("hide");

        } else {
            alert("Failed to Update Review Status");
        }
    }
    catch (err) {
        console.error("Error updating ReviewStatus: ", err);
        alert("An error occurred while updating the Review Status")
    }
})

async function deleteReview(id) {

    if (!confirm("Delete this Review?")) {
        return;
    }
    const res = await fetch(`${api}/testimonials/${id}`, { method: "DELETE" })
    if (res.ok) {
        loadReviews();
    }
    else {
        alert("Failed to delete review");
        console.error(await res.json());
    }
}


document.addEventListener("DOMContentLoaded", loadReviews);
