```javascript
// ============================================
// FACEREC - AI FACE RECOGNITION
// Frontend JavaScript
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const uploadForm = document.getElementById("uploadForm");
    const resultContainer = document.getElementById("results");
    const loadingMessage = document.getElementById("loading");

    if (!fileInput || !uploadForm || !resultContainer) {
        console.error("FaceRec: Required HTML elements were not found.");
        return;
    }

    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const file = fileInput.files[0];

        if (!file) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Optional AI inference parameters
        formData.append("conf", "0.25");
        formData.append("iou", "0.5");
        formData.append("imgsz", "640");

        try {
            if (loadingMessage) {
                loadingMessage.style.display = "block";
            }

            resultContainer.innerHTML = "";

            // Send image to our secure backend
            const response = await fetch("/api/predict", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "AI recognition failed.");
            }

            displayRecognitionResults(result);

        } catch (error) {
            console.error("FaceRec error:", error);

            resultContainer.textContent =
                "Recognition failed: " + error.message;

        } finally {
            if (loadingMessage) {
                loadingMessage.style.display = "none";
            }
        }
    });

    function displayRecognitionResults(data) {
        const images = data.images || [];

        if (images.length === 0) {
            resultContainer.textContent = "No results returned.";
            return;
        }

        let detectionCount = 0;

        images.forEach((imageData) => {
            const detections = imageData.results || [];

            detections.forEach((detection) => {
                detectionCount++;

                const card = document.createElement("div");
                card.className = "recognition-result";

                const name = document.createElement("h3");
                name.textContent = detection.name || "Unidentified";

                const confidence = document.createElement("p");
                const score = Number(detection.confidence || 0);
                confidence.textContent =
                    `Confidence: ${(score * 100).toFixed(2)}%`;

                card.appendChild(name);
                card.appendChild(confidence);

                resultContainer.appendChild(card);
            });
        });

        if (detectionCount === 0) {
            resultContainer.textContent =
                "The AI did not detect any objects or faces.";
        }
    }
});
```