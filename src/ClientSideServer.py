import asyncio
import json
import logging
import os
import sys
import traceback

import aiohttp
import websockets
from aiohttp import web

import RadioController


UI_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ui")


class ClientSideServer:
    def __init__(self, radio_controller, host="localhost", port=1111):
        self.host = host
        self.radio_controller = radio_controller
        self.port = port

        self.server = None
        self.log_level = logging.DEBUG

    async def handle_http_request(self, request):
        filepath = UI_DIR + request.path
        if os.path.exists(filepath) and os.path.isfile(filepath):
            return web.FileResponse(filepath)
        else:
            return web.Response(text=f"File not found: {request.path}", status=404)

    async def start_http_server(self):
        app = aiohttp.web.Application()
        app.router.add_route("GET", "/{path:.+}", self.handle_http_request)

        port = 8000
        runner = aiohttp.web.AppRunner(app)
        await runner.setup()
        site = aiohttp.web.TCPSite(runner, "localhost", port)
        await site.start()

        print(f"HTTP server started on http://localhost:{port}")

    async def data_handler(self, websocket):
        '''reads data from a websocket connection, parses the data and executes.
           message format is { mode: 'LSB', freq: 7130000 }
        '''
        async for message in websocket:
            response = None
            try:
                data = json.loads(message)
                freq = data['freq']
                if self.log_level <= logging.INFO:
                    print(f"mode: {data['mode']}")
                    print(f"freq: {freq}")
                self.radio_controller.set_mode(data['mode'])
                self.radio_controller.set_frequency("A", freq)
                response = json.dumps({"status": 1})
            except Exception as e:
                traceback.print_exc(e)
                response = json.dumps({"status": 0})
            finally:
                await websocket.send(response)

    def run(self, dummy_mode=False):
        self.radio_controller.init_radio()

        self.server = websockets.serve(self.data_handler, self.host, self.port)
        if self.log_level <= logging.INFO:
            print(f"Server started at ws://{self.host}:{self.port}")

        asyncio.get_event_loop().run_until_complete(self.server)
        asyncio.get_event_loop().run_until_complete(self.start_http_server())
        asyncio.get_event_loop().run_forever()


def main():
    radio_controller_types = {
        "dummy": RadioController.DummyRadioController,
        "omnirig": RadioController.OmnirigRadioController,
    }
    if len(sys.argv) > 1:
        radio_controller_type = sys.argv[1]
    else:
        radio_controller_type = "omnirig"
    radio_controller = radio_controller_types[radio_controller_type]()

    rc = ClientSideServer(radio_controller)
    rc.run()


if __name__ == "__main__":
    main()
