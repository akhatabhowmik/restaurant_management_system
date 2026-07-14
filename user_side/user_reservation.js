const API_URL = "http://localhost:8000"
const form = document.getElementById("bookingForm");
const today = new Date().toISOString().split("T")[0];
document.querySelector('[name="date"]').min = today;

const dateInput = document.getElementById("reservationDate");
const maxDate = new Date().toISOString().split("T")[0];
const slotContainer = document.getElementById("slot-container");
const slotButtons = document.getElementById("slot-buttons");
const selectedSlot = document.getElementById("selectedSlot");


dateInput.addEventListener("change", async () => {
    selectedDate = dateInput.value;
    if (!selectedDate) return;
    loadavailableSlots(selectedDate);


});

async function loadavailableSlots(date) {
    try {
        const res = await fetch(`${API_URL}/reservations/slot_availability?date=${date}`);
        const slots = await res.json();

        renderSlotBtn(slots);
    }
    catch (err) {
        console.error("Error", err);
        alert("Unavailable to get slots");
    }
}

function renderSlotBtn(slots) {
    slotButtons.innerHTML = "";
    selectedSlot.value = "";
    slotContainer.style.display = "block";
    Object.entries(slots).forEach(([time, count]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = time;
        button.classList.add("btn");
        if (count >= 5) {
            button.classList.add("btn-secondary");
            button.disabled = true;
            button.textContent += `(Not Available)`;
        } else {
            button.classList.add("btn-outline-light");
            button.addEventListener("click", () => {
                selectSlot(button, time);
            });
        }
        slotButtons.appendChild(button);
    })

}

function selectSlot(button, time) {
    document.querySelectorAll("#slot-buttons button").forEach(btn => {
        btn.classList.remove("active");
    });
    button.classList.add("active");
    selectedSlot.value = time;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("user_access_token");
    if (!token) {
        alert("Please login first!");
        window.location.href = "../user_side/user_login.html";
        return;
    }
    if (!selectedSlot.value) {
        alert("Please select a time slot");
        return;
    }

    const formData = {
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        phone: form.querySelector('[name="phone"]').value,
        date: form.querySelector('[name="date"]').value,
        time: selectedSlot.value,
        party_size: parseInt(form.querySelector('[name="party_size"]').value),
        event: form.querySelector('[name="event"]').value,
        message: form.querySelector('[name="message"]').value || null,
        menu_items: window.selectedMenuItems && window.selectedMenuItems.length ? JSON.stringify(window.selectedMenuItems) : null
    };

    try {
        const res = await fetch(`${API_URL}/reservations/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            const result = await res.json();
            console.log("api response:", result);
            alert("Booking Confirmed.\n Your Reservation id is: " + result.id);
            form.reset();
        } else {
            const error = await res.json();
            alert("Booking Failed: " + JSON.stringify(error.detail));
        }
    }
    catch (error) {
        alert("Could not connect to the network. Try again later.");
        console.log(error);
    }
});
