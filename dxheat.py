import requests
import json

class cluster:
    
    @staticmethod
    def get_spots(band, limit=30):
        assert isinstance(band, int)
        assert isinstance(limit, int)
        limit = min(50,limit)
        # Define the URL
        url = f"https://dxheat.com/source/spots/?a={limit}&b={band}&cdx=EU&cdx=NA&cdx=SA&cdx=AS&cdx=AF&cdx=OC&cdx=AN&cde=EU&cde=NA&cde=SA&cde=AS&cde=AF&cde=OC&cde=AN&m=CW&m=PHONE&valid=1&spam=0"

        # Fetch the XML data from the URL
        response = requests.get(url)

        # Check if request was successful
        if response.status_code == 200:
            # Parse JSON string to a Python list
            spots = []
            for spot in json.loads(response.content):
                time = spot["Date"] + " " + spot["Time"]
                spotter = spot["Spotter"]
                dx = spot["DXCall"]
                dx_locator = spot["DXLocator"]
                #print(f"Time: {time}, Spotter: {spotter}, DX: {dx}, Frequency: {frequency}")
                spots.append({"time": time, "spotter": spotter, "dx": dx, "dx_locator": dx_locator, "band": band})
            return spots
        else:
            return []
           
    @staticmethod
    def get_mock_spot():
        return [{"time": 0, "spotter": "KC4GL", "dx": "AA1SQ", "band": 15}]

if __name__ == "__main__":
    spots = cluster.get_spots(band=15, limit=5)
    for spot in spots: print(f'time: {spot["time"]}, spotter: {spot["spotter"]}, dx: {spot["dx"]}, dx_locator: {spot["dx_locator"]}, band: {spot["band"]}')