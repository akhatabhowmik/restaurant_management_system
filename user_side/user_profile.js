const api = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("user_access_token");
    if (!token) {
        alert("Please login to view your profile.");
        window.location.href = "user_login.html";
        return;
    }

    loadUserProfile(token);
    loadUserReservation(token);

    document.getElementById("profileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        updateProfile(token);
    })
});

async function loadUserProfile(token) {
    const res = await fetch(`${api}/auth/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (res.ok) {
        const data = await res.json();
        document.getElementById("editUsername").value = data.username;
        document.getElementById("editEmail").value = data.email;
        document.getElementById("editPhone").value = data.phone;

        const avatarElement = document.getElementById("profileAvatar");
        if (avatarElement) {
            avatarElement.textContent = getInitials(data.username);
        }

        const avatarName = document.getElementById("avatarName");
        if (avatarName) {
            avatarName.textContent = data.username;
        }
        else {
            alert("Failed to load user profile.");
            window.location.href = "user_login.html"
        }
    }

}

async function updateProfile(token) {
    const payload = {
        username: document.getElementById("editUsername").value,
        phone: document.getElementById("editPhone").value
    };
    try {
        const res = await fetch(`${api}/auth/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert("Profile Updated Successfully");
            window.location.reload();
        }
        else {
            const data = await res.json();
            alert("Update Failed: " + (data.detail || "Unknown error"));
        }
    }
    catch (err) {
        console.error(err);
        alert("Unable to reach server...");
    }
}


function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}


async function loadUserReservation(token) {

    const tableBody = document.getElementById("reservationTable");
    try {
        const res = await fetch(`${api}/reservations/user_reservation`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            tableBody.innerHTML = "";
            if (!Array.isArray(data) || data.length === 0) {
                tableBody.innerHTML += `<tr><td colspan="6" class="text-center text-muted">No reservations found.</td></tr>`;
            }
            data.forEach((reservation, index) => {
                const tr = document.createElement("tr");
                // Parse menu items if they exist
                let menuString = "None";
                if (reservation.menu_items) {
                    try {
                        const items = JSON.parse(reservation.menu_items);
                        menuString = items.map(item => `${item.name} (x${item.qty})`).join(", ");
                    } catch (e) {
                        menuString = reservation.menu_items;
                    }
                }
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.time}</td>
                    <td>${reservation.party_size}</td>
                    <td>${reservation.event_type || "N/A"}</td>
                    <td>${menuString}</td>
                `;
                tableBody.appendChild(tr);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load reservations.</td></tr>`;
        }
    } catch (err) {
        console.error("Error fetching reservations:", err);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Unable to load reservations.</td></tr>`;
    }
}