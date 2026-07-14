const api_url = "http://127.0.0.1:8000";

async function loadUserReservation() {
    const token = localStorage.getItem("user_access_token");
    if (!token) {
        console.log("No seesion found, user should log in first");
        alert("Please Login First");
    }
    const res = await fetch(`${api_url}/reservation/user_reservation`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
        const reservations = await res.json();
        console.log("Reservation Data:", reservations);
    }
    else {
        const error = await res.json();
        console.log("Error:", error);
    }
}

/*function renderReservations(reservations) {
    const reservationList = document.getElementById("reservation-list");
    reservationList.innerHTML = "";
    reservations.forEach(reservation => {
        const reservationCard = document.createElement("div");
        reservationCard.classList.add("card");
        reservationCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Reservation ID: ${reservation.id}</h5>
                <p class="card-text">Date: ${reservation.date}</p>
                <p class="card-text">Time: ${reservation.time}</p>
                <p class="card-text">Number of Guests: ${reservation.guests}</p>
                <p class="card-text">Status: ${reservation.status}</p>
            </div>
        `;
        reservationList.appendChild(reservationCard);
    });
}*/