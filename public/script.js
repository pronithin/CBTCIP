// Declare otp_val globally to make it accessible
let otp_val;

// Function to send OTP
function sendOTP() {
    const email = document.getElementById("email").value;
    otp_val = Math.floor(Math.random() * 10000);
    const emailbody = `<h2>Your OTP is </h2> ${otp_val}`;

    // Sending email using SMTPJS
    Email.send({
        SecureToken: "b1ea8b76-b3cf-4036-a4f4-ef4a9e949330", // Your SecureToken
        To: email,
        From: "mrramakrishna311@gmail.com",
        Subject: "OTP Verification",
        Body: emailbody,
    }).then(message => {
        if (message === "OK") {
            alert("OTP sent to your email: " + email);
            document.getElementById("otpVerification").style.display = "block"; // Show OTP verification input
        }
    });
}

// Function to verify OTP
function verifyOTP() {
    const otp_inp = document.getElementById('otp_inp').value;
    if (otp_inp === otp_val.toString()) {
        alert("Email address verified...");
        document.getElementById("updateForm").style.display = "block"; // Show update form
    } else {
        alert("Invalid OTP");
    }
}
