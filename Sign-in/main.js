function signIn() {
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;

    if (!email || !password) {
        alert("Please fill in both fields");
        return;
    }

    // Simulate a login process (replace with actual authentication logic)
    if (email === "admin" && password === "123") {
        alert("Login successful");
    } else {
        alert("Login failed");
    }
}