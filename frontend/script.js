const button = document.getElementById("test-backend");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
    output.textContent = "Calling backend...";

    try {
        const response = await fetch("http://127.0.0.1:5000/api/hello");
        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        output.textContent = "Error: " + err.message;
        console.error(err);
    }
});

const sendPromptBtn = document.getElementById("send-prompt");
const promptInput = document.getElementById("prompt");

sendPromptBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
        output.textContent = "Please enter a prompt.";
        return;
    }

    output.textContent = "Sending to AI...";

    try {
        const response = await fetch("http://127.0.0.1:5000/api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        output.textContent = "Error: " + error.message;
    }
});
