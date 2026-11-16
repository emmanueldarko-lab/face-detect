# FaceRec — Face Detection Web App

A React + Vite image-only face-detection interface based on the supplied landing-page reference.

## Included pages
- Public landing page matching the supplied FaceRec design direction
- Workspace overview/dashboard
- Image upload and preview (JPG, PNG, WEBP; 15 MB maximum)
- Detection results page
- Browser-local detection history
- Settings and API connection status

Video upload and live-camera features are intentionally excluded. This app is a **face detector**, not an identity-recognition system: the model detects face locations; it does not identify who a person is.

## 1. Run the frontend

Open PowerShell in this folder:

```powershell
cd "C:\Users\USER\OneDrive\Desktop\Document Folder\AI\Face Detection"
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

If PowerShell cannot find `npm`, use:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## 2. Connect the model backend

The frontend expects a backend endpoint:

`POST {VITE_API_BASE_URL}/detect`

The request is `multipart/form-data` with one field named `file`.

Example JSON response:

```json
{
  "face_count": 2,
  "detections": [
    { "class_name": "face", "confidence": 0.986, "x1": 120, "y1": 80, "x2": 260, "y2": 250 },
    { "class_name": "face", "confidence": 0.941, "x1": 330, "y1": 90, "x2": 455, "y2": 230 }
  ],
  "annotated_image": "http://127.0.0.1:8000/results/annotated-image.jpg"
}
```

`annotated_image` is optional. The frontend also accepts `image_url`, and accepts `count` or `faces` as aliases for the count/detections fields.

Create a `.env` file from `.env.example` and set the backend URL, for example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart the Vite server after changing `.env`.

The backend must enable CORS for the frontend origin (usually `http://localhost:5173`). Keep model-provider credentials and private keys on the backend. Do not expose them in `VITE_*` variables.

## 3. Build for production

```powershell
npm run build
```

The production files are generated in `dist/`.

## Important
The frontend scaffold is ready, but real inference will not run until the FastAPI/deployed-model endpoint is supplied and configured. It intentionally does not fabricate detection results.
