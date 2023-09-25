// JavaScript to handle tracking animation and actions
document.getElementById("track-button").addEventListener("click", function () {
    var statusElement = document.getElementById("status");
    var statusBarElement = document.querySelector(".status-bar");
    var overlay = document.getElementById("overlay");

    var statuses = ["Order Placed", "Dispatched", "In Transit", "Delivered"];
    var currentStatus = statusElement.innerText;

    var currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < statuses.length - 1) {
        // Update the status
        statusElement.innerText = statuses[currentIndex + 1];

        // Calculate the width percentage for the status bar
        var widthPercentage = (currentIndex + 2) * (100 / statuses.length);

        // Animate the status bar width
        statusBarElement.style.width = widthPercentage + "%";

        if (statuses[currentIndex + 1] === "Delivered") {
            // If the status is "Delivered," show the green line and the full-screen alert
            statusBarElement.style.backgroundColor = "#28a745";
            showCongratulationsAlert();
        }
    }
});

// Function to show the full-screen congratulations alert
function showCongratulationsAlert() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "flex"; // Display the overlay

    // Handle the "I am proud of me" link click within the alert
    var proudLink = document.getElementById("proud-link");
    proudLink.addEventListener("click", function (e) {
        e.preventDefault();
        toggleFeedbackForm(); // Show or hide the feedback form
    });

    // Handle the form submission
    var feedbackForm = document.getElementById("feedback-form");
    var feedbackText = document.getElementById("feedback-text");
    var feedbackSubmitButton = feedbackForm.querySelector("button[type=submit]");
    feedbackForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // Implement your feedback submission logic here
        alert("Thank you for your feedback!");
        toggleFeedbackForm(); // Hide the feedback form after submission
    });
}

// Function to toggle the visibility of the feedback form
function toggleFeedbackForm() {
    var feedbackForm = document.getElementById("feedback-form");
    feedbackForm.classList.toggle("hidden");
}
