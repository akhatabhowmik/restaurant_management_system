const api = "http://localhost:8000";

const stars = document.querySelectorAll(".star-rating i");
const ratingInput = document.getElementById("reviewer_rating");
stars.forEach((star, index1) => {
    star.addEventListener("click", () => {
        ratingInput.value = index1 + 1;
        stars.forEach((s, index2) => {
            if (index1 >= index2) {
                s.classList.add("active");
                s.style.color = "#f38910";

            } else {
                s.classList.remove("active");
                s.style.color = "#ffffff";

            }

        });
    });
});

document.getElementById("saveReviewFormBtn").addEventListener("click", async () => {
    const formData = new FormData();
    formData.append("name", document.getElementById("reviewer_name").value);
    formData.append("designation", document.getElementById("reviewer_designation").value);
    formData.append("review", document.getElementById("reviewer_review").value);
    formData.append("rating", ratingInput.value);






    const imageInput = document.getElementById("reviewer_image_url");
    const imageFile = imageInput ? imageInput.files[0] : null;
    if (imageFile) formData.append("image", imageFile);

    try {
        const res = await fetch(`${api}/testimonials/add_testimonials`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        if (res.ok) {
            $('#testimonialModal').modal('hide');
            alert("Review saved");
            location.reload();
        } else {
            alert("Failed to save review");
            console.error("Server error:", data);
        }
    }
    catch (error) {
        alert("Connection Error. Try again");
        console.log(error);
    }

});

async function addReview(params) {

}