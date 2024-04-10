import type { AWS } from '@serverless/typescript';

export const EventBridge: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::Events::EventBus',
  Properties: { Name: 'NodeTeam' },
};
