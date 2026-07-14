const api = "http://localhost:8000"

async function adminLogin(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", document.getElementById("adminEmail").value);
    formData.append("password", document.getElementById("adminPassword").value);

    try {
        const res = await fetch(`${api}/auth/login`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            const profileRes = await fetch(`${api}/auth/profile`, {
                headers: {
                    "Authorization": `Bearer ${data.access_token}`
                }
            });
            if (profileRes.ok) {
                const profile = await profileRes.json();
                if (profile.role === "admin") {
                    localStorage.setItem("access_token", data.access_token);
                    window.location.href = "index.html";

                }
                else {
                    alert("Access Denied: You are not authorized to login as admin");
                }
            }
            else {
                alert("Failed to fetch profile");
            }

        }
        else {
            alert("Invalid Credentials");
        }
    }
    catch (error) {
        console.error("Error:", error);
        alert("An error occurred while logging in.");
    }

}