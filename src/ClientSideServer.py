from contextlib import asynccontextmanager
import asyncio
import logging
import mimetypes
import random
import socket
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

logger = logging.getLogger(__name__)

HOST = "localhost"
# Port collision is very unlikely
port = port = random.randint(10000, 60000)


async def start_webbrowser():
    """Waiting until the server is listening to requests"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    logger.info("Checking if the server is up")
    while True:
        result = sock.connect_ex((HOST, port))
        if result == 0:
            break
        logger.info("The server is not listening...")
        await asyncio.sleep(1)

    logger.info("The server is up, openning browser")
    sock.close()

    webbrowser.open(f"http://{HOST}:{port}/")


@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    if os.environ.get("DUMMY") is not None:
        app.state.radio_controller = RadioController.DummyRadioController()
    else:
        app.state.radio_controller = RadioController.OmnirigRadioController()

    logger.info("Initializing radio")
    app.state.radio_controller.init_radio()

    asyncio.create_task(start_webbrowser())

    yield


app = fastapi.FastAPI(lifespan=lifespan)


@app.websocket("/radio")
async def websocket_endpoint(websocket: fastapi.WebSocket):
    await websocket.accept()
    await websocket.send_json({"status": "connected"})
    while True:
        try:
            data = await websocket.receive_json()
            mode = data["mode"]
            band = int(data["band"])
            freq = data["freq"]
            slot = "A"

            if mode.upper() == "SSB":
                if band in (160, 80, 40):
                    mode = "LSB"
                else:
                    mode = "USB"

            logger.info(f"Setting mode: {mode}")
            app.state.radio_controller.set_mode(mode)

            logger.info(f"Setting frequency: {freq} in slot {slot}")
            app.state.radio_controller.set_frequency(slot, freq)

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


def main():
    uvicorn.run(app, host=HOST, port=port)


if __name__ == "__main__":
    main()
