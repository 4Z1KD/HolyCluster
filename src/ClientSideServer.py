import os

import fastapi
from fastapi.staticfiles import StaticFiles
import mimetypes

import RadioController

mimetypes.init()
mimetypes.add_type("text/javascript", ".js")

UI_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ui")

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
    while True:
        data = await websocket.receive_json()
        app.state.radio_controller.set_mode(data["mode"])
        app.state.radio_controller.set_frequency("A", data["freq"])
        await websocket.send_json({"status": 1})


app.mount("/", StaticFiles(directory=UI_DIR), name="static")
