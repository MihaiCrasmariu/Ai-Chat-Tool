const testBackendBtn = document.getElementById("test-backend");
const sendPromptBtn = document.getElementById("send-prompt");
const promptInput = document.getElementById("prompt");
const output = document.getElementById("output");

// baza URL-ului de backend (Render)
const BASE_URL = "https://ai-chat-tool-backend.onrender.com";



// ------------------------------
// Test backend: GET /api/hello
// ------------------------------
testBackendBtn.addEventListener("click", async () => {
    output.textContent = "Checking backend...";

    try {
        const response = await fetch(`${BASE_URL}/api/hello`);
        const data = await response.json();

        // afișăm DOAR mesajul, nu JSON-ul
        if (data.message) {
            output.textContent = data.message;
        } else {
            output.textContent = JSON.stringify(data, null, 2);
        }

    } catch (error) {
        output.textContent = "Error: " + error.message;
        console.error(error);
    }
});


// ------------------------------
// AI endpoint: POST /api/ai
// ------------------------------
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        // dacă backend-ul trimite { response: "...text..." }
        if (data.response) {
            output.textContent = data.response;
        } else {
            output.textContent = JSON.stringify(data, null, 2);
        }

    } catch (error) {
        output.textContent = "Error: " + error.message;
        console.error(error);
    }
});
// ------------------------------
// Image understanding (vision)
// ------------------------------
const imageInput = document.getElementById("image-input");
const imagePromptInput = document.getElementById("image-prompt");
const analyzeImageBtn = document.getElementById("analyze-image");

if (analyzeImageBtn) {
    analyzeImageBtn.addEventListener("click", async () => {
        const file = imageInput.files[0];

        if (!file) {
            output.textContent = "Please upload an image first.";
            return;
        }

        const prompt = imagePromptInput.value.trim() || "Describe this image in detail.";

        output.textContent = "Analyzing image...";

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("prompt", prompt);

            const response = await fetch(`${BASE_URL}/api/vision`, {
                method: "POST",
                body: formData
            });

            // luam textul brut
            const text = await response.text();

            // incercam sa il parsam ca JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                // daca nu e JSON (e HTML / eroare Flask), il afisam direct
                output.textContent = text;
                return;
            }

            output.textContent = data.response || data.error || JSON.stringify(data, null, 2);
        } catch (error) {
            output.textContent = "Error: " + error.message;
            console.error(error);
        }
    });
}



// ------------------------------
// Image generation (text → image)
// ------------------------------
const genPromptInput = document.getElementById("gen-prompt");
const genImageBtn = document.getElementById("gen-image");
const genImageResult = document.getElementById("gen-image-result");

if (genImageBtn) {
    genImageBtn.addEventListener("click", async () => {
        const prompt = genPromptInput.value.trim();

        if (!prompt) {
            genImageResult.textContent = "Please enter a prompt for the image.";
            return;
        }

        genImageResult.textContent = "Generating image...";

        try {
            const response = await fetch(`${BASE_URL}/api/image`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (data.image_data_url) {
                const img = new Image();
                img.src = data.image_data_url;
                img.alt = prompt;
                img.style.maxWidth = "100%";
                img.style.borderRadius = "12px";
                img.style.border = "1px solid rgba(148, 163, 184, 0.7)";

                genImageResult.innerHTML = "";
                genImageResult.appendChild(img);
            } else {
                genImageResult.textContent = data.error || "Unknown error while generating image.";
            }
        } catch (error) {
            genImageResult.textContent = "Error: " + error.message;
            console.error(error);
        }
    });
}
