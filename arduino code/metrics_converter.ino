/*
1. Initialize Accelerometer
2. Set concussion threshold to 70g
3. While true:
4.     Read x, y, z values from accelerometer
5.     Convert raw values to g-forces
6.     Calculate magnitude: sqrt(x² + y² + z²)
7.     If magnitude > threshold:
8.         Print "Potential concussion detected!"
9.     Short delay
*/

#include <Wire.h>

#define ADXL375_ADDRESS 0x53
#define THRESHOLD 70.0  // 70g threshold

void setup() {
  Serial.begin(115200);
  Wire.begin();
  
  // Initialize ADXL375
  writeRegister(ADXL375_ADDRESS, 0x2D, 0x08);  // Power control register
  writeRegister(ADXL375_ADDRESS, 0x31, 0x0B);  // Data format: 200g range, full resolution
  writeRegister(ADXL375_ADDRESS, 0x2C, 0x0E);  // Rate control: 3200Hz
}

void loop() {
  // Read raw accelerometer data
  int16_t rawX, rawY, rawZ;
  uint8_t buffer[6];
  
  Wire.beginTransmission(ADXL375_ADDRESS);
  Wire.write(0x32);  // Start at X data register
  Wire.endTransmission(false);
  Wire.requestFrom(ADXL375_ADDRESS, 6, true);
  
  for (int i = 0; i < 6; i++) {
    buffer[i] = Wire.read();
  }

  // Convert to 16-bit values (left-justified)
  rawX = (buffer[1] << 8) | buffer[0];
  rawY = (buffer[3] << 8) | buffer[2];
  rawZ = (buffer[5] << 8) | buffer[4];

  // Convert to g-forces (12-bit resolution, 49mg/LSB)
  float x = (rawX >> 4) * 0.049;
  float y = (rawY >> 4) * 0.049;
  float z = (rawZ >> 4) * 0.049;

  // Calculate vector magnitude
  float magnitude = sqrt(sq(x) + sq(y) + sq(z));

  // Check against threshold
  if (magnitude >= THRESHOLD) {
    Serial.print("Impact detected! Magnitude: ");
    Serial.print(magnitude);
    Serial.println("g");
    // Add additional alert actions here
  }

  delay(1);  // Minimal delay for high-speed sampling
}

void writeRegister(uint8_t device, uint8_t reg, uint8_t value) {
  Wire.beginTransmission(device);
  Wire.write(reg);
  Wire.write(value);
  Wire.endTransmission();
}