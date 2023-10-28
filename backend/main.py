from fastapi import FastAPI
import uvicorn

from routers import (
    auth,
    # music
)

# FastAPIの用意
app = FastAPI()

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"]
)

# app.include_router(
#     music.router,
#     prefix="/music",
#     tags=["music"]
# )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
