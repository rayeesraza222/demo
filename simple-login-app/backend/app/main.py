from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Mount static files at the root directory to serve index.html and assets directly
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
