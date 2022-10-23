import * as Amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { MessageRPC, Data, RPCCLientData, ResponseRPC } from './types';

// tslint:disable-next-line: no-any
export const sendRPCMessage = (channel: Amqp.Channel, queue: Amqp.Replies.AssertQueue, correlationId: string, queueName: string, request: MessageRPC, next: (error?: any, data?: Data) => void): void => {
    try {
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(request)), {
            replyTo: queue.queue,
            correlationId: correlationId
        });

        channel.consume(queue.queue, msg => {
            if (msg.properties.correlationId === correlationId) {
                const response: ResponseRPC = JSON.parse(msg.content.toString()) as ResponseRPC;
                if (response.error) {
                    return next(response.error);
                }
                else {
                    return next(null, response.response);
                }
            }
        }, { noAck: true });

    } catch (error) {
        console.log('RPC_CLIENT_SEND Error: ', error)
    }
}

export const createClient = async (): Promise<RPCCLientData> => {
    try {
        const connection = await Amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = await channel.assertQueue('', { exclusive: true, autoDelete: true });
        const uuid = uuidv4();
        return { queue: queue, channel: channel, corrId: uuid }
    } catch (error) {
        console.log('RPC_CREATE_CLIENT Error: ', error)
    }
}