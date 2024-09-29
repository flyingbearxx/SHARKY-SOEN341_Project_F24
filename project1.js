

function validateLogin() 
{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Simple validation check
    if (username === "admin" && password === "12345") {
        alert("Login successful!");
        return true;
    } else {
        errorMessage.textContent = "Invalid username or password";
        errorMessage.style.display = "block";
        return false;
    }
}

function openLogin(){
window.location.href = "project1.html";
}


function openreset(){
 href="Resetpw.html";
 window.open.href="Resetpw.html";
}


function togglePasswordVisibility() {
    var passwordField = document.getElementById("password");
    var eyeIcon = document.querySelector(".show-password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.textContent = "🙈"; // Change icon to closed eye when visible
    } else {
        passwordField.type = "password";
        eyeIcon.textContent = "👁️"; // Change back to open eye when hidden
    }
}


function toggleButton(activeButton) {
    const studentBtn = document.getElementById('student-btn');
    const teacherBtn = document.getElementById('teacher-btn');

    if (activeButton === 'teacher') {
        // Switch to Teacher
        studentBtn.classList.remove('active');
        teacherBtn.classList.add('active');
        studentBtn.textContent = 'Student'; // Reset text
        teacherBtn.textContent = 'Teacher'; // Set text
    } else {
        // Switch to Student
        teacherBtn.classList.remove('active');
        studentBtn.classList.add('active');
        teacherBtn.textContent = 'Teacher'; // Reset text
        studentBtn.textContent = 'Student'; // Set text
    }
}


    document.addEventListener("DOMContentLoaded", function() {
        const studentBtn = document.getElementById('student-btn');
        const teacherBtn = document.getElementById('teacher-btn');
        const switchBg = document.querySelector('.switch-bg');

        studentBtn.addEventListener('click', function() {
            if (!studentBtn.classList.contains('active')) {
                studentBtn.classList.add('active');
                teacherBtn.classList.remove('active');
                switchBg.style.setProperty('transform', 'translateX(0)');
            }
        });

        teacherBtn.addEventListener('click', function() {
            if (!teacherBtn.classList.contains('active')) {
                teacherBtn.classList.add('active');
                studentBtn.classList.remove('active');
                switchBg.style.setProperty('transform', 'translateX(100px)');
            }
        });
    });
    function validateEmail() {
        const email = document.getElementById('email').value;
        const errorMessage = document.getElementById('error-message');
        
        if (!email.includes('@') || !email.includes('.')) {
            errorMessage.textContent = "Please enter a valid email address.";
            return false;
        }

        errorMessage.textContent = "";
        return true;
    }

    var nameofuser,username,password,email;
    function userinfo(){
          nameofuser = document.getElementById("nameoftheuser").value;
         username = document.getElementById("username").value;
         password = document.getElementById("password").value;
         email = document.getElementById("email").value;
    }

    function showthename(){
        console.log("Welcome" + nameofuser + "!");
    }

    function validSubmit() {
        // Get values from the form
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmpassword = document.getElementById('confirm-password').value;
        const errormessage = document.getElementById('error-message');

        // Clear previous error messages
        errormessage.textcontent = '';

        // Validation checks
        if (!username) {
            errormessage.textcontent = 'Username is required.';
            return false;
        }

        if (!email) {
            errormessage.textcontent = 'Email is required.';
            return false;
        }

        // Simple email validation regex
        const emailpattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailpattern.test(email)) {
            errormessage.textcontent = 'Please enter a valid email address.';
            return false;
        }

        if (!password) {
            errormessage.textcontent = 'Password is required.';
            return false;
        }

        if (password.length < 6) {
            errormessage.textcontent = 'Password must be at least 6 characters long.';
            return false;
        }

        if (password !== confirmpassword) {
            errormessage.textcontent = 'Passwords do not match.';
            return false;
        }

        // If all validations pass
        alert('Sign up successful!');
        window.location.href = "welcomepage.html";
        return true;}


        function generateStudentInputs() {
            const studentCount = document.getElementById("studentCount").value;
            const container = document.getElementById("studentInputsContainer");
            container.innerHTML = ""; // Clear previous inputs

            for (let i = 0; i < studentCount; i++) {
                const inputField = document.createElement("input");
                inputField.type = "text";
                inputField.placeholder = `Student ${i + 1} Name`;
                inputField.className = "input-field";
                container.appendChild(inputField);
                container.appendChild(document.createElement("br")); // Line break
            }

            // For debugging purposes
            console.log(`Generated ${studentCount} input fields.`);
        }

        function submitData() {
            const teamName = document.getElementById("teamName").value;
            const studentNames = [...document.querySelectorAll("#studentInputsContainer input")].map(input => input.value);
            console.log("Team Name:", teamName);
            console.log("Student Names:", studentNames);

            // Here you can handle the submission, e.g., send data to a server or display it
            alert("Data submitted successfully!\nTeam Name: " + teamName + "\nStudents: " + studentNames.join(", "));
        }