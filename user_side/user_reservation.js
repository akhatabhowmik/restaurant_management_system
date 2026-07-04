const API_URL = "http://localhost:8000"
const form = document.getElementById("bookingForm");
const today = new Date().toISOString().split("T")[0];
document.querySelector('[name="date"]').min = today;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        phone: form.querySelector('[name="phone"]').value,
        date: form.querySelector('[name="date"]').value,
        time: form.querySelector('[name="time"]').value,
        party_size: parseInt(form.querySelector('[name="party_size"]').value),
        event: form.querySelector('[name="event"]').value,
        message: form.querySelector('[name="message"]').value || null,
        menu_items: window.selectedMenuItems && window.selectedMenuItems.length ? JSON.stringify(window.selectedMenuItems) : null
    };


    try {
        const res = await fetch(`${API_URL}/reservations/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
            alert("Booking Failed: \n" + JSON.stringify(error.detail));
        }
    }
    catch (error) {
        alert("Could not connect to the network. Try again later.");
        console.log(err);
    }
});
