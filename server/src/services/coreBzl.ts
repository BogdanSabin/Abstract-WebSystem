import { Factory } from './../factory';
import { config } from './../config';
import { startRpcServer } from '../RabbitMQ';

const queueName = config.rpc.coreBzl.queueName;

startRpcServer(queueName) // initialize RPC server
    .then(() => {
        return Factory.getInstance(); // initialize Factory
    })
    .then(() => {
        console.log('CoreBzl server started!');
    })
    .catch(error => {
        console.log('Error while starting CoreBzl server...', error);
    });