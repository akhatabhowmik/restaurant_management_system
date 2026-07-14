const api = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Load initial profile data
    loadProfileDetails(token);

    // Setup submit event listener to update profile
    document.getElementById("profileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        updateProfileDetails(token);
    });
});

// Helper function to extract initials from name
function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// 1. Fetch profile and populate form/avatar
async function loadProfileDetails(token) {
    try {
        const res = await fetch(`${api}/auth/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (res.ok) {
            const data = await res.json();

            // Populate form
            document.getElementById("editUsername").value = data.username;
            document.getElementById("editEmail").value = data.email;
            document.getElementById("editPhone").value = data.phone || "";

            // Populate avatar in sidebar
            const avatar = document.getElementById("profileAvatar");
            const avatarName = document.getElementById("avatarName");
            if (avatar) avatar.textContent = getInitials(data.username);
            if (avatarName) avatarName.textContent = data.username;
        }
    } catch (err) {
        console.error("Error loading profile details:", err);
    }
}

// 2. Submit updated details to backend
async function updateProfileDetails(token) {
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
            alert("Profile updated successfully!");
            loadProfileDetails(token);

            // Update the topbar username element if present on the page
            const topbarName = document.getElementById("profilename");
            if (topbarName) topbarName.textContent = payload.username;
        } else {
            const data = await res.json();
            alert("Update failed: " + (data.detail || "Unknown error"));
        }
    } catch (err) {
        console.error("Error updating profile:", err);
        alert("Unable to reach the server.");
    }
}


