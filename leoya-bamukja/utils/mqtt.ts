import mqtt, { MqttClient } from 'mqtt';

// MQTT Topic Constants
export const MQTT_TOPICS = {
  CAMERA_STREAM: 'catfeeder/camera/stream',
  MOTOR_FEED: 'catfeeder/motor/feed',
  SCHEDULE_SET: 'catfeeder/schedule/set',
  STATUS: 'catfeeder/status',
  LOGS: 'catfeeder/logs',
} as const;

// MQTT Connection Configuration
export interface MqttConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  clientId?: string;
}

// Default MQTT configuration (can be overridden)
export const DEFAULT_MQTT_CONFIG: MqttConfig = {
  host: 'localhost', // Will be configured to ESP32S3 IP
  port: 1883,
  clientId: `catfeeder_app_${Math.random().toString(16).substr(2, 8)}`,
};

export class MqttConnection {
  private client: MqttClient | null = null;
  private config: MqttConfig;
  private connectionCallbacks: Array<(connected: boolean) => void> = [];
  private messageCallbacks: Array<(topic: string, message: Buffer) => void> = [];

  constructor(config: MqttConfig = DEFAULT_MQTT_CONFIG) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      const connectUrl = `mqtt://${this.config.host}:${this.config.port}`;
      
      this.client = mqtt.connect(connectUrl, {
        clientId: this.config.clientId,
        username: this.config.username,
        password: this.config.password,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      });

      return new Promise((resolve) => {
        this.client!.on('connect', () => {
          console.log('MQTT Connected');
          this.notifyConnectionCallbacks(true);
          resolve(true);
        });

        this.client!.on('error', (error) => {
          console.error('MQTT Connection Error:', error);
          this.notifyConnectionCallbacks(false);
          resolve(false);
        });

        this.client!.on('message', (topic, message) => {
          this.notifyMessageCallbacks(topic, message);
        });

        this.client!.on('close', () => {
          console.log('MQTT Connection Closed');
          this.notifyConnectionCallbacks(false);
        });
      });
    } catch (error) {
      console.error('MQTT Connection Failed:', error);
      return false;
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  subscribe(topic: string): boolean {
    if (!this.client || !this.client.connected) {
      console.error('MQTT client not connected');
      return false;
    }

    this.client.subscribe(topic, (error) => {
      if (error) {
        console.error(`Failed to subscribe to ${topic}:`, error);
      } else {
        console.log(`Subscribed to ${topic}`);
      }
    });

    return true;
  }

  publish(topic: string, message: string | Buffer): boolean {
    if (!this.client || !this.client.connected) {
      console.error('MQTT client not connected');
      return false;
    }

    this.client.publish(topic, message, (error) => {
      if (error) {
        console.error(`Failed to publish to ${topic}:`, error);
      }
    });

    return true;
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  onMessage(callback: (topic: string, message: Buffer) => void): void {
    this.messageCallbacks.push(callback);
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  private notifyConnectionCallbacks(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => callback(connected));
  }

  private notifyMessageCallbacks(topic: string, message: Buffer): void {
    this.messageCallbacks.forEach(callback => callback(topic, message));
  }
}

// Singleton instance for app-wide MQTT connection
let mqttInstance: MqttConnection | null = null;

export const getMqttConnection = (config?: MqttConfig): MqttConnection => {
  if (!mqttInstance) {
    mqttInstance = new MqttConnection(config);
  }
  return mqttInstance;
};