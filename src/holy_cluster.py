from time import time
import copy
import os
import asyncio
from loguru import logger
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
from orthodrome import orthodrome
from dxheat import cluster
from entity_manager import EntityManager
from qrz import qrz
from position import Position
from spot import Spot


class HolyCluster:
    def __init__(self, center:Position):
        self._qrz = qrz(os.path.join(os.path.dirname(__file__),'cfg/qrz.config')) #using entity manager insead
        self.em = EntityManager()
        self.center = center
        self.fig = plt.figure(figsize=(8, 8))
        self.ax = self.fig.add_subplot(111)
        self.num_of_path_points = 30
        self.map = Basemap(projection = 'ortho', lat_0=self.center.lat, lon_0=self.center.lon, ax=self.ax, resolution = 'c')
        self.map.drawcoastlines()
        self.map.drawcountries()
        self.map.drawparallels(np.arange(-90,90,30))
        self.map.drawmeridians(np.arange(0,360,60))
        
        self.fig.canvas.mpl_connect('button_press_event', self.change_center)
        self.spots:list[Spot] = []
        self.raw_spots:list[Spot] = []

        self.color_map = {'10': 'orange', '12': 'brown', '15': 'blue', '17': 'purple', '20': 'red', '40': 'green', '80': 'yellow', '160': 'pink'}

    def change_center(self, event):
        if event.inaxes == self.ax:
                center_lon, center_lat = self.map(event.xdata, event.ydata, inverse=True)
                self.center.lat = center_lat
                self.center.lon = center_lon
                # Recreate Basemap with new center
                self.map = Basemap(projection = 'ortho', lat_0=self.center.lat, lon_0=self.center.lon, ax=self.ax, resolution = 'c')
                
                # Clear old plot
                self.ax.clear()
                # Draw new coastlines and countries
                self.map.drawcoastlines()
                self.map.drawcountries()
                # Redraw the figure
                self.update_display()
                self.fig.canvas.draw()
                self.show()

    def calculate_projected_points(self):
        self.spots.clear()
        for spot in self.raw_spots:
            # clone the spot -> it will be used as a skeleton for the coordinate converted spot
            converted_spot = copy.deepcopy(spot)

            # convert spotter and dx coordinates
            spotter_x, spotter_y = self.map(converted_spot.spotter.location.lon, converted_spot.spotter.location.lat)
            converted_spot.spotter.location = Position(spotter_x, spotter_y)
            dx_x, dx_y = self.map(converted_spot.dx.location.lon, converted_spot.dx.location.lat)
            converted_spot.dx.location = Position(dx_x, dx_y)

            # conver the orthodome points
            converted_spot.orthodrome_pts.clear()
            for point in spot.orthodrome_pts:
                x_ortho, y_ortho = self.map(point.lon, point.lat)
                converted_spot.orthodrome_pts.append(Position(x_ortho, y_ortho))
            
            self.spots.append(converted_spot)

    def update_display(self):
        # Project and Plot center
        x_center, y_center = self.map(self.center.lon, self.center.lat)
        self.map.scatter([x_center], [y_center], color='blue', zorder=5, s=20)

        # Project spots
        self.calculate_projected_points()
        
        # for each band, plot the points and the orthodrome
        for band in self.color_map.keys():
            spots_per_band = [spot for spot in self.spots if str(spot.band) == str(band)]
            if len(spots_per_band) == 0:
                continue
            label = band
            spotter_x_values, spotter_y_values = zip(*[(spot.spotter.location.lat, spot.spotter.location.lon) for spot in spots_per_band])
            dx_x_values, dx_y_values = zip(*[(spot.dx.location.lat, spot.dx.location.lon) for spot in spots_per_band])
            #draw spotter
            self.map.scatter(spotter_x_values, spotter_y_values, zorder=5, s=8, color=self.color_map[band])
            #draw dx
            self.map.scatter(dx_x_values, dx_y_values, zorder=5, s=8, color=self.color_map[band])
                
            #draw direct line
            #self.map.plot([spot.spotter.location.lat,spot.dx.location.lat], [spot.spotter.location.lon,spot.dx.location.lon], color='yellow', linewidth=1, alpha=1)

            #draw orthodrome
            # Extract x and y coordinates into separate lists
            for spot in spots_per_band:
                x_values = [orthodrome_pts.lat for orthodrome_pts in spot.orthodrome_pts]
                y_values = [orthodrome_pts.lon for orthodrome_pts in spot.orthodrome_pts]
                self.map.plot(x_values, y_values, color=self.color_map[band], linewidth=1, alpha=1)
        
    def show(self):
        self.update_display()
        plt.title('Holy Cluster (v1.1.0)')
        #plt.legend(loc='upper left', bbox_to_anchor=(1.02, 1))  # Position the legend outside the plot
        plt.tight_layout()  # Adjust layout to prevent cropping
        plt.show()

    async def populate_spots(self, band):
        logger.debug(f"populate spots {band}")
        some_spots =  await cluster.get_spots(band=band, limit=5)
        [spot.calculate_orthodrome() for spot in some_spots]
        [self.raw_spots.append(s) for s in some_spots]
    
async def main():
    my_qth = orthodrome.grid2position("KM73tv")  # Center coordinates
    holyC = HolyCluster(my_qth)

    bands = [10, 12, 15, 17, 20, 40, 80, 160]
    start =time()
    tasks = []
    for band in bands:
        task = asyncio.create_task(holyC.populate_spots(band))
        tasks.append(task)
    await asyncio.gather(*tasks)
    end =time()
    print(f"elasped time: {end - start}")

    holyC.show()

if __name__ == '__main__':
    asyncio.run(main())