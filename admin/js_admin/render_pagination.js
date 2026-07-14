function renderPagination(totalItems, currentPage, limit, loadFunc) {
    const totalPages = Math.ceil(totalItems / limit);
    const controlsContainer = document.getElementById("pagination-controls");
    const infoContainer = document.getElementById("pagination-info");

    // Update showing info text
    const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalItems);
    infoContainer.textContent = `Showing ${startEntry} to ${endEntry} of ${totalItems} entries`;
    controlsContainer.innerHTML = "";
    if (totalPages <= 1) return;
    // Previous Page Button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<button class="page-link" type="button">Previous</button>`;
    if (currentPage > 1) {
        prevLi.addEventListener("click", () => loadFunc(currentPage - 1));
    }
    controlsContainer.appendChild(prevLi);
    // Number Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement("li");
        pageLi.className = `page-item ${currentPage === i ? 'active' : ''}`;
        pageLi.innerHTML = `<button class="page-link" type="button">${i}</button>`;
        pageLi.addEventListener("click", () => loadFunc(i));
        controlsContainer.appendChild(pageLi);
    }
    // Next Page Button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<button class="page-link" type="button">Next</button>`;
    if (currentPage < totalPages) {
        nextLi.addEventListener("click", () => loadFunc(currentPage + 1));
    }
    controlsContainer.appendChild(nextLi);
}

const profilePage = document.getElementById("")