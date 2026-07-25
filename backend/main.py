from fastapi import FastAPI
from app.api import attendance
from app.api.users import router as user_router
from fastapi.middleware.cors import CORSMiddleware
from app.api import dashboard

app = FastAPI(
    title="VisionAttend AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

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