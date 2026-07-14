const user_signup_api = "http://127.0.0.1:8000";

document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const payload = {
        username: username,
        email: email,
        phone: phone,
        password: password
    };
    try {
        const res = await fetch(`${user_signup_api}/auth/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            alert("User Signed In Successfully!");
            localStorage.setItem("user_access_token", data.access_token);
            window.location.href = "../index.html"
        }
        else {
            alert(data.detail || "Sign-up Failed");
        }
    }
    catch (error) {
        console.error("Error:", error);
        alert("An error occured while signing up.");
    }
})