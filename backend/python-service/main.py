from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn
import os

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow frontend dev server
origins = [
    "http://localhost:5173",
    "http://localhost:3000" # Node API
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@limiter.limit("10/minute")
def read_root(request: Request):
    return {"status": "ok", "service": "python-ai-service"}

@app.get("/api/analyze-sentiment")
@limiter.limit("5/minute")
def analyze_sentiment(request: Request, text: str):
    # Mock AI processing
    return {
        "text": text,
        "sentiment": "positive",
        "confidence": 0.98
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
