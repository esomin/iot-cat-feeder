import mqtt from 'mqtt';
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
      setConnected(true);
      console.log('MQTT Connected');
    });

    client.on('error', (err: Error) => console.log('MQTT Error', err));

    return () => {
      client.end();
    };
  }, []);

  const handleFeed = () => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    client.publish('catfeeder/test', '1'); // LED ON 신호
    setTimeout(() => {
      client.publish('catfeeder/test', '0'); // LED OFF 신호
      client.end();
    }, 2000);
  };

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ marginBottom:12 }}>
        {connected ? '🐾 연결됨' : '연결 중...'}
      </Text>
      <Button title="🍽️ 급식 실행" onPress={handleFeed} />
    </View>
  );
}
