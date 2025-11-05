// src/workers/cronWorker.js

function checkTimeAndTrigger() {
    const now = new Date();

    // Convert current UTC time to IST (UTC + 5:30)
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    const hours = ist.getHours();
    const minutes = ist.getMinutes();

    // Trigger at exactly 23:00 IST
    if (hours === 23 && minutes === 0) {
        fetch("https://autoblog-x3m1.onrender.com/admin/generate-blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Admin-Key": "Ashlesha@3462",
            },
        })
            .then((res) => res.json())
            .then((data) => console.log("Blog generated:", data))
            .catch((err) => console.error("Error generating blog:", err));
    }
}

// Check every minute
setInterval(checkTimeAndTrigger, 60 * 1000);
