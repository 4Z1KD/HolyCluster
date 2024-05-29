from position import Position
from orthodrome import orthodrome

class HamRadioOperator:
    def __init__(self,callsign:str):
        self.callsign = callsign
        self.grid:str = None
        self.location:Position = Position(None,None)

    def __str__(self):
        return f"{self.callsign},{self.grid},{str(self.location)}"

    @property
    def grid(self):
        return self._grid

    @grid.setter
    def grid(self, value):
        self._grid = value
        try:
            self.location = orthodrome.grid2position(self.grid)
        except:
            self.location:Position = Position(None,None)

