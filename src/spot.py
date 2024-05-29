from position import Position
from orthodrome import orthodrome
from ham_radio_operator import HamRadioOperator

class Spot:
    def __init__(self, spotter:HamRadioOperator, dx:HamRadioOperator):
        self.band = ""
        self.timestamp = ""
        self.spotter = spotter
        self.dx = dx
        self.orthodrome_pts:list[Position] = []

    def __str__(self):
        return f"{self.timestamp},{self.band},{str(self.spotter)},{str(self.dx)},\n{[str(p) for p in self.orthodrome_pts]}"
    
    def calculate_orthodrome(self):
        self.orthodrome_pts = orthodrome.get_orthodrome(self.spotter.location.lat,self.spotter.location.lon, self.dx.location.lat,self.dx.location.lon, 15)