from fastapi import FastAPI

from app.api.users import router as user_router

app = FastAPI(
    title="VisionAttend AI",
    version="1.0.0"
)

app.include_router(user_router)


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