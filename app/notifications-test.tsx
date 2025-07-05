import { View, Text, Button } from 'react-native';

import { Container } from '~/components/Container';
import { usePushNotificationsStore } from '~/store/usePushNotificationsStore';

const NotificationsPage = () => {
  const { deviceId, expoPushToken, notification } = usePushNotificationsStore();

  return (
    <Container>
      <Text>Device ID: {deviceId}</Text>
      <Text>Push Token: {expoPushToken}</Text>
      <View>
        <Text>Title: {notification?.request.content.title}</Text>
        <Text>Body: {notification?.request.content.body}</Text>
        <Text>Data: {JSON.stringify(notification?.request.content.data, null, 2)}</Text>
      </View>
    </Container>
  );
};

export default NotificationsPage;
