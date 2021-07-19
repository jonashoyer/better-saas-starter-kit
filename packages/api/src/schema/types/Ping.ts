import { queryField } from "nexus";




export const Ping = queryField('ping', {
  type: 'String',
  required: true,
  resolve() {
    return 'pong';
  }
})