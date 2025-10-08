#include <WiFi.h>
#include "secrets.h"

#define LED_PIN LED_BUILTIN

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.println("WiFi 연결 시도 중...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi 연결 성공");
  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());

  digitalWrite(LED_PIN, HIGH); // 연결 성공 시 LED ON
}

void loop() {
  // 연결 상태 유지
}
