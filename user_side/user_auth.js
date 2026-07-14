async function logout(event) {
    if (event) event.preventDefault();
    const token = localStorage.getItem("user_access_token");
    try {
        await fetch("http://localhost:8000/auth/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    } catch (err) {
        console.error("Logout request failed:", err);
    }
    localStorage.removeItem("access_token");
    window.location.replace("user_login.html");
}
function checkAuth() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.replace("user_login.html");
    }
}
checkAuth();
window.addEventListener("pageshow", checkAuth);