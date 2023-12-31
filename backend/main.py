from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routers import (
    auth,
    spotify,
    music
)

# FastAPIの用意
app = FastAPI()

origins = ["http://localhost:3000", "http://127.0.0.1:3000", "https://dj-hukkin.netlify.app/"]

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
