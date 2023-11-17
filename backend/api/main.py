from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    auth,
    spotify,
    music
)

# FastAPIの用意
app = FastAPI()

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization", "Access-Control-Allow-Origin"],
)

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"]
)

app.include_router(
    spotify.router,
    prefix="/spotify",
    tags=["spotify"]
)

app.include_router(
    music.router,
    prefix="/music",
    tags=["music"]
)
