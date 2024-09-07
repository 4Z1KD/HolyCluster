import logging
import mimetypes
import os

import fastapi
from fastapi.staticfiles import StaticFiles
from starlette.websockets import WebSocketDisconnect
import httpx

import RadioController

# This is a work around for a bug of mimetypes in the windows registry
mimetypes.init()
mimetypes.add_type("text/javascript", ".js")

UI_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ui/dist")

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s %(asctime)s %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
    },
    "loggers": {
        "": {"handlers": ["default"], "level": "INFO"},
    },
})
app = fastapi.FastAPI()


@app.on_event("startup")
async def startup_event():
    if os.environ.get("DUMMY") is not None:
        app.state.radio_controller = RadioController.DummyRadioController()
    else:
        app.state.radio_controller = RadioController.OmnirigRadioController()
    app.state.radio_controller.init_radio()


@app.websocket("/radio")
async def websocket_endpoint(websocket: fastapi.WebSocket):
    await websocket.accept()
    await websocket.send_json({"status": "connected"})
    while True:
        try:
            data = await websocket.receive_json()
            app.state.radio_controller.set_mode(data["mode"])
            app.state.radio_controller.set_frequency("A", data["freq"])
            await websocket.send_json({"result": "success"})
        except WebSocketDisconnect:
            break


@app.get("/spots")
async def spots(response: fastapi.Response):
    async with httpx.AsyncClient() as client:
        result = await client.get("https://holycluster.iarc.org/spots")
        response.body = result.content
        response.status_code = result.status_code
        return response


app.mount("/", StaticFiles(directory=UI_DIR, html=True), name="static")
