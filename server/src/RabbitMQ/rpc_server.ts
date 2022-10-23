import * as Amqp from 'amqplib';
import { MessageRPC, ResponseRPC } from './types';
import { registrarAPI } from '../bzl/api';
import { BzlErrorResponse } from '../bzl/lib/BzlError';

// tslint:disable: no-unsafe-any
export const startRpcServer = async (queueName: string) => {
    try {
        const connection = await Amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { exclusive: true });
        channel.prefetch(1);

        channel.consume(queueName, (msg: Amqp.ConsumeMessage) => {
            const message: MessageRPC = JSON.parse(msg.content.toString()) as MessageRPC;
            const api = message.api;
            const method = message.method;
            if (registrarAPI[api] && registrarAPI[api][method]) {
                registrarAPI[api][method](message.data, (error: BzlErrorResponse | Error, data) => {
                    const response: ResponseRPC = {
                        error: error instanceof Error ? { code: 500, message: error.message + ' ' + error.stack } : error,
                        response: data
                    };
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                        correlationId: msg.properties.correlationId
                    });

                    channel.ack(msg);
                })
            } else {
                const response: ResponseRPC = { error: { message: new Error(registrarAPI[api] ? `Unknown method: ${api}.${method}` : `Unknown API: ${api}`).message, code: 500 } };
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                    correlationId: msg.properties.correlationId
                });

                channel.ack(msg);
            }

        }, { noAck: false });

    } catch (error) {
        console.log('RPC_SERVER ERROR', error);
    }
}