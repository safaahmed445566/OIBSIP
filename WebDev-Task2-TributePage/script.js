
// 1. Dark and light mode
const themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDarkMode =
        document.body.classList.contains("dark-mode");

    if (isDarkMode) {
        themeButton.textContent = "☀️ Light Mode";
    } else {
        themeButton.textContent = "🌙 Dark Mode";
    }
});


// 2. Read More and Read Less
const readMoreButton = document.getElementById("read-more");
const extraBio = document.getElementById("extra-bio");

readMoreButton.addEventListener("click", function () {
    if (extraBio.hidden) {
        extraBio.hidden = false;
        readMoreButton.textContent = "Read Less";
    } else {
        extraBio.hidden = true;
        readMoreButton.textContent = "Read More";
    }
});


// 3. Back-to-top button
const topButton = document.getElementById("back-to-top");

topButton.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// 4. Automatically update the footer year
const yearElement = document.getElementById("current-year");

yearElement.textContent = new Date().getFullYear();
