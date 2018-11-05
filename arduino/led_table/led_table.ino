#include <Arduino.h>
#include <NeoPixelBus.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsServer.h>
#include <Hash.h>
#include <WiFiManager.h>

ESP8266WiFiMulti WiFiMulti;

WebSocketsServer webSocket = WebSocketsServer(81);

#define USE_SERIAL Serial

#define WIDTH 32
#define HEIGHT 16
#define NUM_PIXELS WIDTH * HEIGHT

#define DATA_PIN 2

const uint16_t PixelCount = 4;
NeoPixelBus<NeoGrbFeature, NeoEsp8266Uart800KbpsMethod> strip(NUM_PIXELS, DATA_PIN);

const uint8_t PROGMEM gamma8[] = {
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
    1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
    2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
    5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
   10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
   17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
   25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
   37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
   51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
   69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
   90, 92, 93, 95, 96, 98, 99,101,102,104,105,107,109,110,112,114,
  115,117,119,120,122,124,126,127,129,131,133,135,137,138,140,142,
  144,146,148,150,152,154,156,158,160,162,164,167,169,171,173,175,
  177,180,182,184,186,189,191,193,196,198,200,203,205,208,210,213,
  215,218,220,223,225,228,231,233,236,239,241,244,247,249,252,255 };


void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

    switch(type) {
        case WStype_DISCONNECTED:
            USE_SERIAL.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED:
            {
                IPAddress ip = webSocket.remoteIP(num);
                USE_SERIAL.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
				
				// send message to client
				webSocket.sendTXT(num, "Connected");
            }
            break;
        case WStype_TEXT:
            USE_SERIAL.printf("[%u] get Text: %s\n", num, payload);

            // send message to client
            // webSocket.sendTXT(num, "message here");

            // send data to all connected clients
            // webSocket.broadcastTXT("message here");
            break;
        case WStype_BIN:
            //USE_SERIAL.printf("[%u] get binary length: %u\n", num, length);
            //hexdump(payload, length);

            int *pixelBuffer = (int *)payload;

            for (int j = 0; j < HEIGHT; j++) {

              bool rowInverted = j % 2 == 0;
              
              for (int i = 0; i < WIDTH; i++) {
                
                int readIndex = j*WIDTH + i;
                int writeIndex = readIndex;
                
                if (rowInverted) {
                  writeIndex = j*WIDTH + (WIDTH - i - 1);
                }
                uint32_t color = pixelBuffer[readIndex];
                uint8_t r = (color >> 16) & 0x000000FF;
                uint8_t g = (color >> 8) & 0x000000FF;
                uint8_t b = (color >> 0) & 0x000000FF;
				uint8_t rGamma = pgm_read_byte(&gamma8[r]);
				uint8_t gGamma = pgm_read_byte(&gamma8[g]);
				uint8_t bGamma = pgm_read_byte(&gamma8[b]);
                strip.SetPixelColor(writeIndex, RgbColor(rGamma, gGamma, bGamma));
              }
            }

            strip.Show();

            // send message to client
            // webSocket.sendBIN(num, payload, length);
            break;
    }

}

void setup() {

    WiFiManager wifiManager;
//    wifiManager.resetSettings();
//    wifiManager.setAPStaticIPConfig(IPAddress(10,0,1,1), IPAddress(10,0,1,1), IPAddress(255,255,255,0));
    wifiManager.autoConnect("tabLED");

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    strip.Begin();

    // USE_SERIAL.begin(921600);
    USE_SERIAL.begin(115200);

    //Serial.setDebugOutput(true);
    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }

    webSocket.begin();
//    Serial.printf("IP address:\t");
//    Serial.println(WiFi.localIP());  
    webSocket.onEvent(webSocketEvent);
//    Serial.printf("IP address:\t");
//    Serial.println(WiFi.localIP());  
}

void loop() {
    webSocket.loop();
}
