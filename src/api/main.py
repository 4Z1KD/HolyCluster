from fastapi import FastAPI
from sqlmodel import Field, SQLModel
import uvicorn


app = FastAPI()


if __name__ == "main":
    uvicorn.run(app, host="0.0.0.0", port=8000)