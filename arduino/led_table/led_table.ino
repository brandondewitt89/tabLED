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
                strip.SetPixelColor(writeIndex, RgbColor(r, g, b));
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
    //wifiManager.resetSettings();
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
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();
}

