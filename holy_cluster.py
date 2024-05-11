import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
from orthodrome import orthodrome
from dxheat import cluster
from entity_manager import EntityManager

class HolyCluster:
    def __init__(self, center):
        #self._qrz = qrz('qrz.config') #using entity manager insead
        self.center_lat, self.center_lon = center
        self.fig = plt.figure(figsize=(8, 8))
        self.ax = self.fig.add_subplot(111)
        self.num_of_path_points = 30
        self.map = Basemap(projection = 'ortho', lat_0=self.center_lat, lon_0=self.center_lon, ax=self.ax, resolution = 'c')
        self.map.drawcoastlines()
        self.map.drawcountries()
        self.map.drawparallels(np.arange(-90,90,30))
        self.map.drawmeridians(np.arange(0,360,60))
        
        self.fig.canvas.mpl_connect('button_press_event', self.change_center)
        self.bands_status = []
        self.raw_bands_status = []

    def change_center(self, event):
        if event.inaxes == self.ax:
                self.center_lon, self.center_lat = self.map(event.xdata, event.ydata, inverse=True)
                # Recreate Basemap with new center
                self.map = Basemap(projection = 'ortho', lat_0=self.center_lat, lon_0=self.center_lon, ax=self.ax, resolution = 'c')
                
                # Clear old plot
                self.ax.clear()
                # Draw new coastlines and countries
                self.map.drawcoastlines()
                self.map.drawcountries()
                # Redraw the figure
                #self.update()
                #self.fig.canvas.draw()
                self.show()

    def remove_band_status(seld, array, key_to_find):
        for i, item in enumerate(array):
            if key_to_find in item:
                del array[i]
                break  # Exit the loop after deleting the first occurrence


    def calculate_projected_points(self, points, color, label):
        band_qso_x = [] # a list of x coordinates of the spotter and the dx stations (spotter_x, dx_x)
        band_qso_y = [] # a list of y coordinates of the spotter and the dx stations
        band_qso_x_ortho = []
        band_qso_y_ortho = []
        for point in points:
            spotter_lat, spotter_lon = point[0]
            dx_lat, dx_lon = point[1]

            # convert spotter and dx points
            spotter_x, spotter_y = self.map(spotter_lon, spotter_lat)
            dx_x, dx_y = self.map(dx_lon, dx_lat)
            band_qso_x.append([spotter_x, dx_x])
            band_qso_y.append([spotter_y, dx_y])
            #self.map.scatter([x_p1, x_p2], [y_p1, y_p2], zorder=5, s=8, color=color, label=label)
        
            # Calculate intermediate points along the great circle
            orthodrome_pts = orthodrome.get_orthodrome(spotter_lat, spotter_lon, dx_lat, dx_lon, self.num_of_path_points)
            if not orthodrome_pts:
                continue
            lats, lons = zip(*orthodrome_pts)
            
            # Plot the orthodrome
            x_ortho, y_ortho = self.map(lons, lats)
            band_qso_x_ortho.append(x_ortho)
            band_qso_y_ortho.append(y_ortho)
            #self.map.plot(x_ortho, y_ortho, color=color, linewidth=1, alpha=1)
        
        self.remove_band_status(self.bands_status, label)
        self.bands_status.append({label:{"color":color, "points":(band_qso_x, band_qso_y), "orthodromes":(band_qso_x_ortho, band_qso_y_ortho)}})

    def add_raw_spots(self, spots, color, label):
            self.raw_bands_status.append({label:{"color":color, "spots":spots}})
 
    def update(self):
        # Plot center
        x_center, y_center = self.map(self.center_lon, self.center_lat)
        self.map.scatter([x_center], [y_center], color='blue', zorder=5, s=20)

        # foreach raw band status (consists of the band name, color, and a list of spots i.e. pairs of callsigns, a spotter and a dx)
        # take the spots and find the respresenting grid for the spotter and dx callsigns. than, calculate the projected points
        for raw_band_status in self.raw_bands_status:
            for raw_band in raw_band_status.keys():
                raw_label = raw_band
                raw_color = raw_band_status[raw_band]['color']
                raw_spot_points = raw_band_status[raw_band]['spots']
                self.calculate_projected_points(self.get_spots_locations(raw_spot_points), raw_color, raw_label)

        # for each band, plot the points and the orthodrome
        for band_status in self.bands_status:
            for band in band_status.keys():
                label = band
                color = band_status[band]['color']
                band_qso_x, band_qso_y = band_status[band]['points']
                band_qso_x_ortho, band_qso_y_ortho = band_status[band]['orthodromes']

                #draw points
                self.map.scatter(band_qso_x, band_qso_y, zorder=5, s=8, color=color, label=label)
                #draw orthodrome
                for i in range(len(band_qso_x_ortho)):
                    self.map.plot(band_qso_x_ortho[i], band_qso_y_ortho[i], color=color, linewidth=1, alpha=1)
        

    def show(self):
        self.update()
        plt.title('Holy Cluster (v1.0.2)')
        plt.legend(loc='upper left', bbox_to_anchor=(1.02, 1))  # Position the legend outside the plot
        plt.tight_layout()  # Adjust layout to prevent cropping
        plt.show()
    
    def get_spots_locations(self, spots):
        em = EntityManager()
        spots_loc = []
        #foreach spot, find the respresenting grid for the spotter and dx callsigns. than, calculate the projected points
        for spot in spots:
            try:
                spotter = orthodrome.grid2latlng(em.resolve_grid(spot["spotter"]))
                #dx = orthodrome.grid2latlng(em.resolve_grid(spot["dx"]))
                dx = orthodrome.grid2latlng(spot["dx_locator"])
                spots_loc.append((spotter,dx))
            except:
                continue
        return spots_loc


if __name__ == '__main__':
    my_qth = orthodrome.grid2latlng("KM73tv")  # Center coordinates
    holyC = HolyCluster(my_qth)
    
    holyC.add_raw_spots(cluster.get_spots(band=10, limit=30), 'orange', '10m')
    holyC.add_raw_spots(cluster.get_spots(band=12, limit=30), 'brown', '12m')
    holyC.add_raw_spots(cluster.get_spots(band=15, limit=25), 'blue', '15m')
    holyC.add_raw_spots(cluster.get_spots(band=17, limit=30), 'purple', '17m')
    holyC.add_raw_spots(cluster.get_spots(band=20, limit=30), 'red', '20m')
    holyC.add_raw_spots(cluster.get_spots(band=40, limit=30), 'green', '40m')
    holyC.add_raw_spots(cluster.get_spots(band=80, limit=30), 'yellow', '80m')
    holyC.add_raw_spots(cluster.get_spots(band=160, limit=30), 'pink', '160m')

    #holyC.add_raw_spots(cluster.get_mock_spot(), 'blue', '15m')
    
    holyC.show()
