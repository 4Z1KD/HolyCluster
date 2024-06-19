import logging
import omnipyrig
import asyncio
import websockets
import json
import random


class RadioController:

    def __init__(self, port=8765, log_level=logging.DEBUG):
        self.server = None
        self.OmniClient = None
        self.port = port
        self.log_level = log_level
    
    def __init_radio__(self):
        '''initialize an omnipyrig instance and set active rig'''
        self.OmniClient = omnipyrig.OmniRigWrapper()        
        #set the active rig to 1 (as defined in OmniRig GUI)
        self.OmniClient.setActiveRig(1)
        RigType = self.OmniClient.getParam("RigType")
        StatusStr = self.OmniClient.getParam("StatusStr")
        if self.log_level <= logging.INFO:
            print(f"RigType: {RigType}")
            print(f"StatusStr: {StatusStr}")
    
    async def __data_handler__(self, websocket):
        '''reads data from a websocket connection, parses the data and executes.
           message format is { mode: 'LSB', freq: 7130000 }
        '''
        async for message in websocket:
            try:
                data = json.loads(message)
                mode=RadioController.convertMode(data['mode'])
                freq=data['freq']
                if self.log_level <= logging.INFO:
                    print(f"mode: {mode}")
                    print(f"freq: {freq}")
                self.OmniClient.setMode(mode)
                self.OmniClient.setFrequency("A",freq)
                response = json.dumps({"status": 1})
            except:
                print("error")
                response = json.dumps({"status": 0})
            finally:
                await websocket.send(response)
    
    def __start_server__(self):
        '''serving the websocket'''
        self.server = websockets.serve(self.__data_handler__, "localhost", self.port)
        if self.log_level <= logging.INFO:
                print(f"Server started at ws://localhost:{self.port}")
    
    def __run_listener__(self):
        '''executes the server loop'''
        asyncio.get_event_loop().run_until_complete(self.server)
        asyncio.get_event_loop().run_forever()
    
    def run(self):
        self.__init_radio__()
        self.__start_server__()
        self.__run_listener__()

    @staticmethod
    def convertMode(mode):
        if mode == 'USB':
            return 2
        if mode == 'LSB':
            return 1
        if mode == 'FT8':
            return 12
        if mode == 'CW':
            return 3
    


if __name__ == "__main__":
    rc = RadioController(1111)
    rc.run()