from fastapi import FastAPI

app = FastAPI(
    title="VisionAttend AI",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "VisionAttend AI Backend Running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }