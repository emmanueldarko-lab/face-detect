```javascript
// ============================================
// FACEREC - SECURE AI BACKEND
// Node.js + Express
// ============================================

const express = require("express");
const multer = require("multer");

const app = express();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

const PORT = process.env.PORT || 5000;

const API_URL =
    "https://predict-6afa06239b676272a74fb8e5-dproatj77a-og.a.run.app/predict";

const API_KEY = process.env.ULTRALYTICS_API_KEY;

// Serve frontend files
app.use(express.static("public"));

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "FaceRec backend is running"
    });
});

// AI image prediction
app.post("/api/predict", upload.single("file"), async (req, res) => {

    try {
        if (!API_KEY) {
            return res.status(500).json({
                error: "AI API key is not configured."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "Please upload an image."
            });
        }

        const form = new FormData();

        const imageBlob = new Blob(
            [req.file.buffer],
            { type: req.file.mimetype }
        );

        form.append(
            "file",
            imageBlob,
            req.file.originalname
        );

        form.append("conf", "0.25");
        form.append("iou", "0.5");
        form.append("imgsz", "640");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`
            },
            body: form,
            signal: AbortSignal.timeout(180000)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Ultralytics error:", response.status);

            return res.status(response.status).json({
                error: result.detail || "AI inference failed."
            });
        }

        res.json(result);

    } catch (error) {
        console.error("FaceRec backend error:", error);

        res.status(500).json({
            error: "Unable to process image with the AI model."
        });
    }
});

app.listen(PORT, () => {
    console.log(`FaceRec backend running on port ${PORT}`);
});
```