from fastapi import FastAPI
from app.api import attendance
from app.api import users 
from fastapi.middleware.cors import CORSMiddleware
from app.api import dashboard
from app.api import notification 
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

app.include_router(users.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)
app.include_router(notification.router)

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