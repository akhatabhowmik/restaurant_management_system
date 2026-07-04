const api_review = "http://127.0.0.1:8000";

async function loadTestimonials() {
    const res = await fetch(`${api_review}/testimonials/active`);
    const testimonials = await res.json();

    const inner = document.getElementById("carouselInner");
    inner.innerHTML = "";

    if (testimonials.length === 0) {
        inner.innerHTML = `<div class="carousel-item active">
                                        <div class="review-card">
                                            <div class="row g-0 align-items-stretch">
                                                <!-- LEFT: Orange panel -->
                                                <div class="col-md-4">
                                                    <div class="reviewer-side">
                                                        <div class="reviewer-avatar">
                                                            <img src="images/no_profile.jpg" alt="No Profile">
                                                        </div>
                                                        <h5 class="reviewer-name">No Name</h5>
                                                        <p class="reviewer-title">No Designation</p>
                                                        <div class="review-stars">
                                                            <i class="bi bi-star-fill"></i>
                                                            <i class="bi bi-star-fill"></i>
                                                            <i class="bi bi-star-fill"></i>
                                                            <i class="bi bi-star-fill"></i>
                                                            <i class="bi bi-star-fill"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- RIGHT: Dark quote panel -->
                                                <div class="col-md-8">
                                                    <div class="review-content">
                                                        <div class="review-quote-icon">❝</div>
                                                        <p class="review-text">No Review Available</p>
                                                        <div class="review-meta">
                                                            <span class="review-date">
                                                                <i class="bi bi-calendar3"></i> 
                                                            </span>
                                                            <span class="review-verified">
                                                                <i class="bi bi-patch-check-fill"></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
        return;
    }
    testimonials.forEach((card, index) => {
        const date = card.review_date ? card.review_date.split("T")[0] : "N/A";

        let starHtml = "";
        for (let i = 0; i <= 5; i++) {
            if (i <= card.rating) {
                starHtml += `<i class="bi bi-star-fill"></i>`;
            } else {
                starHtml += `<i class="bi bi-star"></i>`;
            }
        }
        const isActive = index === 0 ? "active" : "";

        inner.innerHTML += `
        <div class="carousel-item ${isActive}">
            <div class="review-card">
                <div class="row g-0 align-items-stretch">
                    <div class="col-md-4">
                        <div class="reviewer-side">
                            <div class="reviewer-avatar">
                                <img src="${api_review}${card.image_url}" alt="${card.name}">
                            </div>
                            <h5 class="reviewer-name">${card.name}</h5>
                            <p class="reviewer-title">${card.designation}</p>
                            <div class="review-stars">
                                ${starHtml}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="review-content">
                            <div class="review-quote-icon">❝</div>
                            <p class="review-text">${card.review}</p>
                            <div class="review-meta">
                                <span class="review-date">
                                    <i class="bi bi-calendar3"></i> ${date}
                                </span>
                                <span class="review-verified">
                                    <i class="bi bi-patch-check-fill"></i> Verified Review
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    });

}

document.addEventListener("DOMContentLoaded", loadTestimonials);