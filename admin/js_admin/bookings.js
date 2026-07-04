const booking_api = "http://127.0.0.1:8000";
async function getBooking() {
    const [res_booking, res_reservation] = await Promise.all([
        fetch(`${booking_api}/reservations/bookings/`),
        fetch(`${booking_api}/reservations/`)
    ]);
    const booking = await res_booking.json();
    const reservation = await res_reservation.json();


    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    const reservationMap = {};
    reservation.forEach(r => {
        reservationMap[r.id] = r;
    });

    booking.forEach(b => {
        const res = reservationMap[b.reservation_id] || {};

        tbody.innerHTML += `
        <tr>
            <td>${b.reservation_id}</td>
            <td>${res.name ?? "-"}</td>
            <td>${res.date ?? "-"}</td>
            <td>${res.time ?? "-"}</td>
            <td>${res.table_number ?? "Not Assigned"}</td>
            <td>${formatMenuItems(b.menu_items) ?? "None"}</td>
            <td>${res.message ?? "None"}</td>
            <td><span><button class="btn btn-primary" onclick="printMenu(${b.id})"><i class="fas fa-print"></i></button></span></td>`;
    })
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
    const [res_booking, res_reservation] = await Promise.all([
        fetch(`${booking_api}/reservations/bookings/`),
        fetch(`${booking_api}/reservations/`)
    ]);
    const booking = await res_booking.json();
    const reservation = await res_reservation.json();

    const reservationMap = {};
    reservation.forEach(r => {
        reservationMap[r.id] = r;
    });

    const singleBooking = booking.find(b => b.id == id);
    const res = reservationMap[singleBooking.reservation_id] || {};
    const menuInvoice = document.getElementById("menuInvoice");

    if (singleBooking) {
        document.getElementById("res_id").textContent = singleBooking.reservation_id ?? "None";
        document.getElementById("table_number").textContent = res.table_number ?? "Not Assigned";
        const itemsContainer = document.getElementById("listedItems");
        itemsContainer.innerHTML = "";

        if (singleBooking.menu_items) {
            try {
                const parsedItems = JSON.parse(singleBooking.menu_items);
                let itemsHtml = "";
                parsedItems.forEach(item => {

                    itemsHtml += `
                        <span><b>${item.name}</b> x ${item.qty}</span><br>`
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

document.addEventListener("DOMContentLoaded", getBooking);