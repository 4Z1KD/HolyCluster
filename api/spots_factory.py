import random
import datetime
import re
import json

class MockFactory():

    @staticmethod
    def generate_random_callsign():
        letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        digits = "0123456789"

        first_letter = random.choice(letters)
        digit = random.choice(digits)
        remaining_letters = ''.join(random.choices(letters, k=random.randint(1, 3)))

        callsign = f"{first_letter}{digit}{remaining_letters}"

        # Ensure the generated callsign matches the regex pattern
        if re.match(r"^[A-Z][0-9][A-Z]{1,3}$", callsign):
            return callsign
        else:
            return MockFactory.generate_random_callsign()

    @staticmethod
    def generate_random_grid_locator():
        letters = "ABCDEFGHIJKLMNOPQRSTUVWX"
        digits = "0123456789"

        first_pair = ''.join(random.choices(letters[:18], k=2))  # Choose from A to R
        digit_pair = ''.join(random.choices(digits, k=2))
        second_pair = ''.join(random.choices(letters, k=2))      # Choose from A to X

        grid_locator = f"{first_pair}{digit_pair}{second_pair}"

        # Ensure the generated grid locator matches the regex pattern
        if re.match(r"^[A-R]{2}[0-9]{2}[A-X]{2}$", grid_locator):
            return grid_locator
        else:
            return MockFactory.generate_random_grid_locator()
    @staticmethod
    def frequency_to_band(frequency_khz):
        bands = {
            "160": (1800, 2000),
            "80": (3500, 4000),
            "60": (5250, 5450),
            "40": (7000, 7300),
            "30": (10100, 10150),
            "20": (14000, 14350),
            "17": (18068, 18168),
            "15": (21000, 21450),
            "12": (24890, 24990),
            "10": (28000, 29700),
            "6": (50000, 54000),
            "2": (144000, 148000),
            "1.25": (222000, 225000),
            "70": (420000, 450000),
            "33": (902000, 928000),
            "23": (1240000, 1300000),
            "13": (2300000, 2450000)
        }

        for band, (low, high) in bands.items():
            if low <= frequency_khz <= high:
                return band
        return "Frequency out of ham radio bands"

    @staticmethod
    def generate_random_spot():
        spotter = MockFactory.generate_random_callsign()
        dx = MockFactory.generate_random_callsign()
        freq = round(random.choice([1880, 3670, 7130, 10130, 14240, 18110, 21300, 24920, 28480])+random.uniform(-30, 20))
        band = MockFactory.frequency_to_band(freq)
        return {
            "Spotter": spotter,
            "spotter_loc": [random.uniform(-180, 180), random.uniform(-90, 90)],
            "dx_loc": [random.uniform(-180, 180), random.uniform(-90, 90)],
            "DXCall": dx,
            "Nr": random.randint(10000000, 99999999),
            "Frequency": str(freq),
            "Time": f"{random.randint(0, 23):02}:{random.randint(0, 59):02}",
            "Date": (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 365))).strftime("%d/%m/%y"),
            "Beacon": random.choice([True, False]),
            "MM": random.choice([True, False]),
            "AM": random.choice([True, False]),
            "Valid": True,
            "DXHomecall": dx,
            "Comment": " ",
            "Flag": random.choice(["my", "us", "uk", "au", "jp"]),
            "Band": int(band),
            "Mode": random.choice(["CW", "SSB", "RTTY"]),
            "Continent_dx": random.choice(["AS", "NA", "EU", "AF", "SA", "OC"]),
            "Continent_spotter": random.choice(["AS", "NA", "EU", "AF", "SA", "OC"]),
            "DXLocator": MockFactory.generate_random_grid_locator()
        }

    @staticmethod
    def generate_random_spots(n):
        return [MockFactory.generate_random_spot() for _ in range(n)]

if __name__ == '__main__':
    # Example usage
    with open("../ui/src/assets/spots.json", "w") as file:
        file.write("[]")
    random_spots = MockFactory.generate_random_spots(20)
    for spot in random_spots:
        with open("../ui/src/assets/spots.json", "r+") as file:
            file_data = json.load(file)
            file_data.append(spot)
            file.seek(0)
            json.dump(file_data, file, indent = 4)
            print(spot)
