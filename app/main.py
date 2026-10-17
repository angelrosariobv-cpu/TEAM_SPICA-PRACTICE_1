"""FastAPI application entry point."""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import flights

app = FastAPI(title="Team Spica Flight Status API", version="1.0.0")

# CORS_ORIGINS accepts comma-separated frontend origins.
origins = [origin.strip() for origin in os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(flights.router)


@app.get("/")
def root():
    return {"message": "Team Spica Flight Status API"}


@app.get("/health")
def health_check():
    # Application liveness only; does not check PostgreSQL availability.
    return {"status": "ok"}
