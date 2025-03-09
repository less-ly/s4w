from skyfield.api import load, Topos
from datetime import datetime
import math
from skyfield.api import utc

# Load the ephemeris data
planets = load('de421.bsp')

# Set the date and time
t = load.timescale().from_datetime(datetime(1970, 1, 1, tzinfo=utc))

# Get the planetary positions
earth = planets['earth barycenter']
positions = {}
for planet in ['mercury barycenter', 'venus barycenter', 'earth barycenter', 'mars barycenter', 'jupiter barycenter', 'saturn barycenter', 'uranus barycenter', 'neptune barycenter']:
    positions[planet] = planets[planet].at(t).position.au

# Calculate the mean anomalies
mean_anomalies = {}
for planet, position in positions.items():
    # Convert to geocentric coordinates
    if planet == 'earth barycenter':
        geocentric_position = position - position  # Earth is the reference point
    else:
        geocentric_position = position - earth.at(t).position.au
    # Calculate the mean anomaly
    distance = math.sqrt(geocentric_position[0]**2 + geocentric_position[1]**2 + geocentric_position[2]**2)
    mean_anomaly_radians = math.atan2(geocentric_position[1], geocentric_position[0])
    mean_anomaly_degrees = math.degrees(mean_anomaly_radians)
    # Ensure degrees are positive
    if mean_anomaly_degrees < 0:
        mean_anomaly_degrees += 360
    mean_anomalies[planet] = mean_anomaly_degrees

# Print the results
for planet, mean_anomaly in mean_anomalies.items():
    print(f"Mean anomaly of {planet} at 1970 January 1: {mean_anomaly} degrees")
