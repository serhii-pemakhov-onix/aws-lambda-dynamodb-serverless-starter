import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

export class EventBridgeClientSingleton {
  private static client: EventBridgeClient | null = null;

  public static getClient() {
    if (!EventBridgeClientSingleton.client) {
      EventBridgeClientSingleton.client = new EventBridgeClient({
        region: process.env.MY_AWS_REGION,
        credentials: {
          accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
        },
      });
    }

    return EventBridgeClientSingleton.client;
  }
}
