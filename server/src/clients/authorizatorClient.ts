import * as _ from 'lodash';
import * as PromiseB from 'bluebird';
import { RPCClient } from './RPCClient';
import { createClient, sendRPCMessage } from '../RabbitMQ';
import { MessageRPC, Data, RPCCLientData } from '../RabbitMQ/types';
import { AutzContext } from '../types';

export class AuthorizatorRpcClient implements RPCClient {
    // tslint:disable-next-line: readonly-keyword
    private autzClient: RPCCLientData;
    private readonly queueName: string;

    constructor(queueName: string) {
        this.queueName = queueName;
    }

    async sendMessage(request: MessageRPC): Promise<Data> {
        return Promise.resolve()
            .then(async () => {
                if (_.isEmpty(this.autzClient)) {
                    const result = await createClient();
                    this.autzClient = result;
                    return this.autzClient;
                }
            }).then(() => {
                return PromiseB.promisify(sendRPCMessage)(this.autzClient.channel, this.autzClient.queue, this.autzClient.corrId, this.queueName, request)
            }).then(data => {
                return this.autzClient.channel.close()
                    .then(() => {
                        this.autzClient = undefined;
                        console.log(_.isEmpty(this.autzClient));
                        return data;
                    })
            }).catch(error => {
                return this.autzClient.channel.close()
                    .then(() => {
                        this.autzClient = undefined;
                        console.log(_.isEmpty(this.autzClient));
                        throw error;
                    })
            })
    }

    async authorize(data: AutzContext): Promise<Data> {
        return this.sendMessage({ api: 'autz', method: 'authorize', data: data })
    }
}