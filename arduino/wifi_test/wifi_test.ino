#include <WiFi.h>
#include <PubSubClient.h>
#include "secrets.h"

// 핀 정의
#define LED_PIN LED_BUILTIN
#define MOTOR_PIN 2  // 모터 제어 핀

// MQTT 설정
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "catfeeder/test";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  
  // 핀 초기화
  pinMode(LED_PIN, OUTPUT);
  pinMode(MOTOR_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(MOTOR_PIN, LOW);

  // WiFi 연결
  setupWiFi();
  
  // MQTT 설정
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  
  // MQTT 연결
  connectMQTT();
}

void setupWiFi() {
  Serial.println("WiFi 연결 시도 중...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi 연결 성공");
  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());
}

void connectMQTT() {
  while (!client.connected()) {
    Serial.print("MQTT 연결 시도 중...");
    
    // 고유한 클라이언트 ID 생성
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("MQTT 연결 성공");
      // 토픽 구독
      client.subscribe(mqtt_topic);
      Serial.print("구독 토픽: ");
      Serial.println(mqtt_topic);
      
      // 연결 성공 표시
      digitalWrite(LED_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_PIN, LOW);
    } else {
      Serial.print("MQTT 연결 실패, rc=");
      Serial.print(client.state());
      Serial.println(" 5초 후 재시도");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("메시지 수신 [");
  Serial.print(topic);
  Serial.print("]: ");
  
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
  
  // 급식 명령 처리
  if (String(topic) == mqtt_topic) {
    if (message == "1") {
      Serial.println("🍽️ 급식 시작!");
      feedCat();
    } else if (message == "0") {
      Serial.println("급식 완료");
      stopFeeding();
    }
  }
}

void feedCat() {
  // LED 켜기 (급식 중 표시)
  digitalWrite(LED_PIN, HIGH);
  
  // 모터 동작 (급식기 작동)
  digitalWrite(MOTOR_PIN, HIGH);
  Serial.println("모터 동작 시작");
  
  // 2초간 모터 동작
  delay(2000);
  
  // 모터 정지
  digitalWrite(MOTOR_PIN, LOW);
  Serial.println("모터 동작 완료");
  
  // LED 끄기
  digitalWrite(LED_PIN, LOW);
}

void stopFeeding() {
  // 안전을 위해 모든 출력 정지
  digitalWrite(LED_PIN, LOW);
  digitalWrite(MOTOR_PIN, LOW);
}

void loop() {
  // MQTT 연결 상태 확인 및 유지
  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();
  
  // WiFi 연결 상태 확인
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi 연결 끊어짐. 재연결 시도...");
    setupWiFi();
  }
  
  delay(100);
}
