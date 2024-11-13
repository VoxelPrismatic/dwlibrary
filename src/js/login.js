const username = $("[name=username]")
const password = $("[name=password]")
const check_pw = $("[name='check-pw']")
const submit = $("[type=submit]")

username.onkeyup = async () => {
    if(!/^[a-zA-Z0-9_]+$/.test(username.value)) {
        username.nextElementSibling.textContent = "You can only use letters, numbers, and underscores";
    } else if(username.value.length < 3) {
        username.nextElementSibling.textContent = "Username is too short";
    } else if(username.value.length > 50) {
        username.nextElementSibling.textContent = "Username is too long";
    } else {
        username.nextElementSibling.textContent = "";
    }

    const resp = await fetch(`/api/login/check-username?username=${username.value}`);
    const data = await resp.json();
    if(data.taken) {
        check_pw.style.display = "none";
    } else {
        check_pw.style.display = "";
    }

    password.onkeyup();
}

password.onkeyup = () => {
    if(password.value.length < 8) {
        password.nextElementSibling.textContent = "Password must be at least 8 characters long";
    } else {
        password.nextElementSibling.textContent = "";
    }

    if(check_pw.style.display === "none") {
        check_pw.value = password.value;
    } else {
        check_pw.value = "";
    }

    check_pw.onkeyup();
}

check_pw.onkeyup = () => {
    if(check_pw.value !== password.value) {
        check_pw.nextElementSibling.textContent = "Passwords don't match";
    } else {
        check_pw.nextElementSibling.textContent = "";
    }

    check_valid();
}

function check_valid() {
    submit.disabled = false;
    for(const span of $$("span.error")) {
        if(span.textContent)
            submit.disabled = true;
    }

    if(check_pw.style.display == "none")
        submit.value = "Log In";
    else
        submit.value = "Create";
}

window.onload = () => {
    username.onkeyup();
    password.onkeyup();
    check_pw.onkeyup();
    check_valid();
};
