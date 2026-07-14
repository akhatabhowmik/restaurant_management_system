const res_api = "http://127.0.0.1:8000";
const username = document.getElementById("profilename");
async function loadProfile() {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
        const res = await fetch(`${res_api}/auth/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            if (username) {
                username.innerText = data.username;
            }
        }

    }
    catch (err) {
        console.error("Error loading profile: ", err);
    }

}

document.addEventListener("DOMContentLoaded", loadProfile);

const profileLink = document.getElementById("profilePage");

if (profileLink) {
    profileLink.addEventListener("click", (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (token) {
            window.location.href = "profile.html";
        } else {
            window.location.href = "login.html";
        }
    });
}
