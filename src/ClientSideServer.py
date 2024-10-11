import argparse
import logging
import mimetypes
import time
import webbrowser
import os

import fastapi
from starlette.websockets import WebSocketDisconnect
import httpx
import uvicorn

import RadioController

# This is a work around for a bug of mimetypes in the windows registry
mimetypes.init()
mimetypes.add_type("text/javascript", ".js")

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

# Ugly hack for passing the host and port to the startup event hook
host = None
port = None


@app.on_event("startup")
async def startup_event():
    if os.environ.get("DUMMY") is not None:
        app.state.radio_controller = RadioController.DummyRadioController()
    else:
        app.state.radio_controller = RadioController.OmnirigRadioController()
    app.state.radio_controller.init_radio()
    # Waiting until the server is listening to request, maybe there is a better way?
    time.sleep(1)
    url = f"http://{host}:{port}/"
    webbrowser.open(url)


@app.websocket("/radio")
async def websocket_endpoint(websocket: fastapi.WebSocket):
    await websocket.accept()
    await websocket.send_json({"status": "connected"})
    while True:
        try:
            data = await websocket.receive_json()
            mode = data["mode"]
            band = int(data["band"])
            if mode == "SSB":
                if band in (160, 80, 40):
                    mode = "LSB"
                else:
                    mode = "USB"

            app.state.radio_controller.set_mode(mode)
            app.state.radio_controller.set_frequency("A", data["freq"])
            await websocket.send_json({"result": "success"})
        except WebSocketDisconnect:
            break


@app.get("/{path:path}")
async def proxy_to_main_server(path: str, response: fastapi.Response):
    async with httpx.AsyncClient() as client:
        result = await client.get(f"https://holycluster.iarc.org/{path}")
        response.body = result.content
        response.status_code = result.status_code
        for (key, value) in result.headers.items():
            response.headers[key] = value
        return response


def parse_args():
    parser = argparse.ArgumentParser()
    # For some reason, the host must be "localhost" on windows, "0.0.0.0" doens't work
    # With webbrowser.open.
    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=7373)
    return parser.parse_args()


def main():
    args = parse_args()

    global host, port
    host = args.host
    port = args.port

    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    main()
