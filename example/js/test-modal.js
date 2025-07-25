// Test file to verify modal functionality
console.log("Testing modal functionality...");

// Test if modal elements exist
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("systemModal");
    const closeButton = document.querySelector(".close-modal");

    console.log("Modal element:", modal);
    console.log("Close button:", closeButton);

    if (modal) {
        console.log("Modal found successfully");
    } else {
        console.error("Modal not found!");
    }

    if (closeButton) {
        console.log("Close button found successfully");
    } else {
        console.error("Close button not found!");
    }

    // Test modal opening
    setTimeout(() => {
        console.log("Testing modal opening...");
        if (typeof openSystem === "function") {
            console.log("openSystem function is available");
        } else {
            console.error("openSystem function not found!");
        }
    }, 2000);
});
