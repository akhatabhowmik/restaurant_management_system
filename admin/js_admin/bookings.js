const booking_api = "http://127.0.0.1:8000";

let currentPage = 1;
const itemsPerPage = 10;
let loadedBookings = [];

async function getBooking(page = 1) {
    currentPage = page;
    const res_booking = await fetch(`${booking_api}/reservations/bookings/?page=${page}&limit=${itemsPerPage}`);
    const booking = await res_booking.json();

    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    if (booking.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">No bookings found.</td></tr>`;
        renderPagination(0, 1, itemsPerPage, getBooking);
        return;
    }
    loadedBookings = booking.data;

    booking.data.forEach(b => {
        tbody.innerHTML += `
        <tr>
            <td>${b.reservation_id}</td>
            <td>${b.name ?? "-"}</td>
            <td>${b.date ?? "-"}</td>
            <td>${b.time ?? "-"}</td>
            <td>${b.table_number ?? "Not Assigned"}</td>
            <td>${formatMenuItems(b.menu_items) ?? "None"}</td>
            <td>${b.message ?? "None"}</td>
            <td><span><button class="btn btn-primary" onclick="printMenu(${b.id})"><i class="fas fa-print"></i></button></span></td>`;
    });
    renderPagination(booking.total, booking.page, booking.limit, getBooking);
}

function formatMenuItems(menuItemsJson) {
    if (!menuItemsJson) return "None";

    try {
        let items = JSON.parse(menuItemsJson);
        if (typeof items === "string") {
            items = JSON.parse(items);
        }

        return items.map(item => item.name).join(",");

    }
    catch (err) {
        console.error("Error parsing menu items:", err);
        return "None";
    }

}


async function printMenu(id) {
    const singleBooking = loadedBookings.find(b => b.id == id);
    const menuInvoice = document.getElementById("menuInvoice");

    if (singleBooking) {
        document.getElementById("res_id").textContent = singleBooking.reservation_id ?? "None";
        document.getElementById("table_number").textContent = singleBooking.table_number ?? "Not Assigned";
        const itemsContainer = document.getElementById("listedItems");
        itemsContainer.innerHTML = "";

        if (singleBooking.menu_items) {
            try {
                const parsedItems = JSON.parse(singleBooking.menu_items);
                let itemsHtml = "";
                parsedItems.forEach(item => {
                    itemsHtml += `<span><b>${item.name}</b> x ${item.qty}</span><br>`;
                });
                itemsContainer.innerHTML = itemsHtml;
            }
            catch (err) {
                console.error("Error parsing menu items:", err);
                itemsContainer.innerHTML = "No menu items available";
            }
        }
        else {
            itemsContainer.innerHTML = "No menu items available";
        }
    }
    $('#printMenuModal').modal('show');
}


document.addEventListener("DOMContentLoaded", () => getBooking(1));