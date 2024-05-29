import requests
import xml.etree.ElementTree as ET

class cluster:
    
    @staticmethod
    def get_spots(band, limit=30):
        assert isinstance(band, int)
        assert isinstance(limit, int)
        limit = min(50,limit)
        # Define the URL
        url = f"https://dxlite.g7vjr.org/?xml=1&noft8=1&band={band}&limit={limit}"

        # Fetch the XML data from the URL
        response = requests.get(url)

        # Check if request was successful
        if response.status_code == 200:
            # Parse XML data
            root = ET.fromstring(response.content)
            spots = []
            # Iterate through spots and print QSO details
            for spot in root.findall('spot'):
                time = spot.find('time').text
                spotter = spot.find('spotter').text
                dx = spot.find('dx').text
                frequency = spot.find('frequency').text
                comment = spot.find('comment').text
                dxcc = spot.find('dxcc').text
                #print(f"Time: {time}, Spotter: {spotter}, DX: {dx}, Frequency: {frequency}")
                spots.append({"time": time, "spotter": spotter, "dx": dx, "band": band})
            return spots
        else:
            return []
            #print("Failed to fetch data.")
    
    @staticmethod
    def get_mock_spot():
        return [{"time": 0, "spotter": "KC4GL", "dx": "AA1SQ", "band": 15}]

if __name__ == "__main__":
    spots = cluster.get_spots(band=15, limit=25)
    for spot in spots: print(f'time: {spot["time"]}, spotter: {spot["spotter"]}, dx: {spot["dx"]}, band: {spot["band"]}')