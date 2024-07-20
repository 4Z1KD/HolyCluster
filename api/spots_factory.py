import argparse
import datetime
import json
import random
import string
import time


FREQUENCIES = [1880, 3670, 7130, 10130, 14240, 18110, 21300, 24920, 28480]
BANDS = {
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
    # "2m": (144000, 148000),
    # "1.25m": (222000, 225000),
    # "70cm": (420000, 450000),
    # "33cm": (902000, 928000),
    # "23cm": (1240000, 1300000),
    # "13cm": (2300000, 2450000)
}


def generate_random_callsign():
    first_letter = random.choice(string.ascii_uppercase)
    digit = random.choice(string.digits)
    remaining_letters = ''.join(random.choices(string.ascii_uppercase, k=random.randint(1, 3)))

    callsign = f"{first_letter}{digit}{remaining_letters}"
    return callsign


def generate_random_grid_locator():
    # Choose from A to R
    first_pair = "".join(random.choices(
        string.ascii_uppercase[:string.ascii_uppercase.index("R") + 1],
        k=2
    ))
    digit_pair = "".join(random.choices(string.digits, k=2))
    # Choose from A to X
    second_pair = "".join(random.choices(
        string.ascii_uppercase[:string.ascii_uppercase.index("X") + 1],
        k=2
    ))

    grid_locator = f"{first_pair}{digit_pair}{second_pair}"
    return grid_locator


def frequency_to_band(frequency_khz):
    for band, (low, high) in BANDS.items():
        if low <= frequency_khz <= high:
            return band
    return "Frequency out of ham radio bands"


def generate_random_spot(spot_time):
    spotter = generate_random_callsign()
    dx = generate_random_callsign(),
    freq = round(random.choice(FREQUENCIES) + random.uniform(-30, 20))
    band = frequency_to_band(freq)

    return {
        "Spotter": spotter,
        "spotter_loc": [random.uniform(-180, 180), random.uniform(-90, 90)],
        "dx_loc": [random.uniform(-180, 180), random.uniform(-90, 90)],
        "DXCall": dx,
        "Nr": random.randint(10000000, 99999999),
        "Frequency": freq,
        "time": spot_time,
        "Beacon": random.choice([True, False]),
        "MM": random.choice([True, False]),
        "AM": random.choice([True, False]),
        "Valid": True,
        "DXHomecall": dx,
        "Comment": " ",
        "Flag": random.choice(["my", "us", "uk", "au", "jp"]),
        "Band": band,
        "Mode": random.choice(["CW", "SSB", "RTTY"]),
        "Continent_dx": random.choice(["AS", "NA", "EU", "AF", "SA", "OC"]),
        "Continent_spotter": random.choice(["AS", "NA", "EU", "AF", "SA", "OC"]),
        "DXLocator": generate_random_grid_locator()
    }


def generate_random_spots(n):
    current_time = int(time.time())
    spots = []
    for _ in range(n):
        current_time -= random.randint(10, 30)
        spots.append(generate_random_spot(current_time))
    return spots


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output")
    parser.add_argument("--number-of-spots", type=int, default=20)
    return parser.parse_args()


def main():
    args = parse_args()
    random_spots = generate_random_spots(args.number_of_spots)
    with open(args.output, "w") as output_file:
        json.dump(random_spots, output_file, indent=4)


if __name__ == '__main__':
    main()
