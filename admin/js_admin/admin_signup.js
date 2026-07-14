const signup_api = "http://127.0.0.1:8000";

async function adminSignUp(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("exampleInputEmail").value;
    const phone = document.getElementById("PhoneNumber").value;
    const password = document.getElementById("exampleInputPassword").value;
    const confirm_password = document.getElementById("ConfirmPassword").value;

    if (password !== confirm_password) {
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
        const res = await fetch(`${signup_api}/auth/admin/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            alert("Admin registered successfully");
            window.location.href = "index.html";
        }
        else {
            alert(data.detail || "Sign Up Failed");
        }
    }
    catch (error) {
        console.error("Error:", error);
        alert("An error occurred while signing up.");
    }



}