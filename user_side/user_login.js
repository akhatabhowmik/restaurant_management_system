const api = "http://localhost:8000"

const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("username", document.getElementById("email").value);
    formData.append("password", document.getElementById("password").value);

    try {
        const res = await fetch(`${api}/auth/login`, {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("user_access_token", data.access_token);
            window.location.href = "http://127.0.0.1:5500/index.html";
        }
        else {
            alert("Invalid Credentials");
        }
    }
    catch (err) {
        console.error("Error: ", err);
        alert("An error occured while logging in");
    }

});