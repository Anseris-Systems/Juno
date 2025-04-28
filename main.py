from flask import Flask, jsonify, render_template
import serial
import threading
import random
import math

app = Flask(__name__)

# Windows: 'COM3', Mac/Linux: '/dev/ttyUSB0' or similar
SERIAL_PORT = 'COM9'
BAUD_RATE = 9600


def read_serial():
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE)
    line = ser.readline().decode('utf-8').strip()
    data = [float(i) for i in line[9:].split(',')]
    return data



@app.route('/data', methods=['GET'])
def get_data():
    try:
        x, y, z = read_serial()
    except serial.SerialException as e:
        x = random.randint(0, 150)
        y = random.randint(0, 150)
        z = random.randint(0, 150)

    player_id = random.randint(1, 10)
    player_name = "Player" + str(player_id)
        
    hit = math.sqrt(x**2 + y**2 + z**2)

    data = {
        "x": x,
        "y": y,
        "z": z,
        "player_id": player_id,
        "player_name": player_name,
        "hit": hit
    }

    return jsonify(data)

@app.route('/')
def index():
    return render_template('./main.html')

if __name__ == '__main__':
    # threading.Thread(target=read_serial, daemon=True).start()
    app.run()
