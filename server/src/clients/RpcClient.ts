import { MessageRPC, Data } from '../RabbitMQ/types';

export interface RPCClient {
    sendMessage(request: MessageRPC): Promise<Data>
}