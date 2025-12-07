const testBackendBtn = document.getElementById("test-backend");
const sendPromptBtn = document.getElementById("send-prompt");
const promptInput = document.getElementById("prompt");
const output = document.getElementById("output");

// baza URL-ului de backend (Render)
const BASE_URL = "https://ai-chat-tool-backend.onrender.com";

// Test backend: GET /api/hello
testBackendBtn.addEventListener("click", async () => {
    output.textContent = "Checking backend...";

    try {
        const response = await fetch(`${BASE_URL}/api/hello`);
        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        output.textContent = "Error: " + error.message;
        console.error(error);
    }
});

// AI endpoint: POST /api/ai
sendPromptBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
        output.textContent = "Please enter a prompt.";
        return;
    }

    output.textContent = "Sending to AI...";

    try {
        const response = await fetch(`${BASE_URL}/api/ai`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        output.textContent = "Error: " + error.message;
        console.error(error);
    }
});
