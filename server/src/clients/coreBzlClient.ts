import * as _ from 'lodash';
import * as PromiseB from 'bluebird';
import { RPCClient } from './RPCClient';
import { createClient, sendRPCMessage } from '../RabbitMQ';
import { MessageRPC, Data, RPCCLientData } from '../RabbitMQ/types';

export class CoreBzlRpcClient implements RPCClient {
    // tslint:disable-next-line: readonly-keyword
    private coreBzlClient: RPCCLientData;
    private readonly queueName: string;

    constructor(queueName: string) {
        this.queueName = queueName;
    }

    async sendMessage(request: MessageRPC): Promise<Data> {
        return Promise.resolve()
            .then(async () => {
                if (_.isEmpty(this.coreBzlClient)) {
                    const result = await createClient();
                    this.coreBzlClient = result;
                    return this.coreBzlClient;
                }
            }).then(() => {
                return PromiseB.promisify(sendRPCMessage)(this.coreBzlClient.channel, this.coreBzlClient.queue, this.coreBzlClient.corrId, this.queueName, request)
            }).then(data => {
                return this.coreBzlClient.channel.close()
                    .then(() => {
                        this.coreBzlClient = undefined;
                        console.log(_.isEmpty(this.coreBzlClient));
                        return data;
                    })
            }).catch(error => {
                return this.coreBzlClient.channel.close()
                    .then(() => {
                        this.coreBzlClient = undefined;
                        console.log(_.isEmpty(this.coreBzlClient));
                        throw error;
                    })
            })
    }
}