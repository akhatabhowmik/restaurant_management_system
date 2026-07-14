const today_res_api = "http://localhost:8000";



async function loadTodayReservations() {
    const res = await fetch(`${today_res_api}/reservations/today_reservations`);
    const reservation = await res.json();

    const pen_res = await fetch(`${today_res_api}/reservations/pending_reservations`);
    const pending = await pen_res.json();

    const count_menu_res = await fetch(`${today_res_api}/menu/availabe_menu/count`);
    const count_menu_items = await count_menu_res.json();
    const menu_card = document.getElementById("menu-card");
    menu_card.innerHTML = count_menu_items.count;

    const count_chef_res = await fetch(`${today_res_api}/chefs/active_count`);
    const count_chef = await count_chef_res.json();
    const chef_card = document.getElementById("chef-card");
    chef_card.innerHTML = count_chef.count;

    const count_booking = await fetch(`${today_res_api}/reservations/today_booking_count`);
    const count_booking_items = await count_booking.json();
    const booking_card = document.getElementById("bookings-card");
    booking_card.innerHTML = count_booking_items.count;

    const confirm_tbody = document.querySelector("#confirm_dataTable tbody")
    confirm_tbody.innerHTML = "";

    const pending_tbody = document.querySelector("#pending_dataTable tbody");
    pending_tbody.innerHTML = "";

    if (res.ok) {
        try {
            reservation.forEach(b => {
                confirm_tbody.innerHTML += `
                <tr>
                    <td>${b.id}</td>
                    <td>${b.name}</td>
                    <td>${b.phone}</td>
                    <td>${b.date}</td>
                    <td>${b.time}</td>
                    <td>${b.party_size}</td>
                    <td>${b.event_type}</td>
                    <td>${b.table_number}</td>
                    <td>${b.status}</td>
                </tr>`
            });

        }
        catch (err) {
            console.err(err);
            tbody.innerHTML = `<tr>
                <td colspan="9" class="text-center">No reservations found.</td>
            </tr>`;
        }
    } else {
        pending_tbody.innerHTML = `<tr>
                <td colspan="9" class="text-center">No reservations found.</td>
            </tr>`;
        confirm_tbody.innerHTML = `<tr>
                <td colspan="9" class="text-center">No reservations found.</td>
            </tr>`;
    }

    if (pen_res.ok) {
        try {
            pending.forEach(b => {
                pending_tbody.innerHTML += `
                <tr>
                    <td>${b.id}</td>
                    <td>${b.name}</td>
                    <td>${b.phone}</td>
                    <td>${b.date}</td>
                    <td>${b.time}</td>
                    <td>${b.party_size}</td>
                    <td>${b.event_type}</td>
                    <td>${b.table_number}</td>
                    <td>${b.status}</td>
                </tr>`
            });

        }
        catch (err) {
            console.err(err);
            pending_tbody.innerHTML = `<tr>
                <td colspan="9" class="text-center">No reservations found.</td>
            </tr>`;
        }
    } else {
        pending_tbody.innerHTML = `<tr>
                <td colspan="9" class="text-center">No reservations found.</td>
            </tr>`;
    }


}



document.addEventListener("DOMContentLoaded", () => {
    loadTodayReservations()
});