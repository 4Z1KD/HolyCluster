import json
import asyncio
from loguru import logger
import httpx
import requests
from position import Position
from ham_radio_operator import HamRadioOperator
from spot import Spot
from entity_manager import EntityManager

class cluster:
    
    @staticmethod
    async def get_spots(band, limit=30)->list[Spot]:
        logger.debug(f"band={band}   limit={limit}")
        assert isinstance(band, int)
        assert isinstance(limit, int)
        limit = min(50,limit)
        # Define the URL
        url = f"https://dxheat.com/source/spots/?a={limit}&b={band}&cdx=EU&cdx=NA&cdx=SA&cdx=AS&cdx=AF&cdx=OC&cdx=AN&cde=EU&cde=NA&cde=SA&cde=AS&cde=AF&cde=OC&cde=AN&m=CW&m=PHONE&valid=1&spam=0"

        # Fetch the XML data from the URL
        # response = requests.get(url)
        # print(f"response: {response.content}")
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
        logger.debug(f"{response.content}")

        em = EntityManager()

        # Check if request was successful
        if response.status_code == 200:
            # Parse JSON string to a Python list
            spots = []
            for spot in json.loads(response.content):
                time = spot["Date"] + " " + spot["Time"]
                spotter_call = spot["Spotter"]
                dx_call = spot["DXCall"]
                dx_locator_resolved = em.resolve_grid(dx_call)
                dx_locator = spot.get("DXLocator", dx_locator_resolved) #spot["DXLocator"]
                #print(f"Time: {time}, Spotter: {spotter}, DX: {dx}, Frequency: {frequency}")
                spotter = HamRadioOperator(spotter_call)
                spotter.grid = em.resolve_grid(spotter.callsign)
                dx = HamRadioOperator(dx_call)
                dx.grid = dx_locator
                newspot = Spot(spotter=spotter, dx=dx)
                newspot.timestamp = time
                newspot.band = band
                #spots.append({"time": time, "spotter": spotter_call, "dx": dx_call, "dx_locator": dx_locator, "band": band})
                spots.append(newspot)
            return spots
        else:
            return []
           
    @staticmethod
    def get_mock_spots()->list[Spot]:
        #return [{"time": 0, "spotter": "KC4GL", "dx": "AA1SQ", "band": 15}]
        
        em = EntityManager()
        
        spotter=HamRadioOperator("4Z1KD")
        spotter.grid = em.resolve_grid(spotter.callsign)        
        
        dx=HamRadioOperator("SP9SP")
        dx.grid = em.resolve_grid(dx.callsign)

        s = Spot(spotter, dx)
        s.band = 15
        s.timestamp = "14/05/24 03:40"
        return [s]

if __name__ == "__main__":
    spots = cluster.get_spots(band=12, limit=15)
    #for spot in spots: print(f'time: {spot["time"]}, spotter: {spot["spotter_call"]}, dx: {spot["dx_call"]}, dx_locator: {spot["dx_locator"]}, band: {spot["band"]}')
    for spot in spots: print(spot)