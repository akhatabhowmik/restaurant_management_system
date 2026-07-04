const api = "http://localhost:8000";
async function loadReservations() {
    const res = await fetch(`${api}/reservations`);
    const reservation = await res.json();

    const tbody = document.querySelector("#dataTable tbody")
    tbody.innerHTML = "";
    reservation.forEach(b => {
        tbody.innerHTML += `
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
             <td class="text-center" style="font-size:0.8rem;"><button class="btn btn-primary btn-sm mt-2" onclick="editReservation(${b.id})">View</button><br>
             <button class="btn btn-danger btn-sm mt-2" onclick="deleteReservation(${b.id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
    });

}

async function editReservation(id) {
    editReservationId = id;
    const res = await fetch(`${api}/reservations/${id}`);
    if (res.ok) {
        const reservation = await res.json();
        document.getElementById("name").textContent = reservation.name ?? "";
        document.getElementById("phone").textContent = reservation.phone ?? "";
        document.getElementById("date").textContent = reservation.date ?? "";
        document.getElementById("time").textContent = reservation.time ?? "";
        document.getElementById("party_size").textContent = reservation.party_size ?? "";
        document.getElementById("event_type").textContent = reservation.event_type ?? "";
        document.getElementById("table-number").value = reservation.table_number ?? "";
        document.getElementById("status").value = reservation.status;

        document.getElementById("updateReservationBtn").v
        $('#editReservationModal').modal('show');

    }
    else {
        alert("Failed to fetch reservation details...");
    }

}

document.getElementById("updateReservationBtn").addEventListener("click", async () => {
    const table_number = document.getElementById("table-number");
    const status = document.getElementById("status");
    const formData = new FormData();
    formData.append("table_number", table_number.value);
    formData.append("status", status.value);
    try {
        const res = await fetch(`${api}/reservations/${editReservationId}/status`, {
            method: "PUT",
            body: formData,

        })

        if (res.ok) {
            const reservation = await res.json();
            loadReservations();
            alert("Reservation updated successfully!");
            $("#editReservationModal").modal("hide");
        }
        else {
            alert("Failed to update reservation!");
        }
    }
    catch (err) {
        console.error("Error updating reservation:", err);
        alert("Error updating reservation!");
    }
})

async function deleteReservation(id) {
    if (!confirm("Delete this reservation")) return;
    const res = await fetch(`${api}/reservations/${id}`, {
        method: "DELETE",
    });
    if (res.ok) {
        const reservation = await res.json();
        loadReservations();
        alert("Reservation deleted successfully!");
    }
    else {
        alert("Failed to delete reservation!");
    }

}

document.addEventListener("DOMContentLoaded", loadReservations);