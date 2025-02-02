import amqp, { Channel, Connection } from 'amqplib';

export default class RabbitMqConfig {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    constructor () {}

    async connect(queueName: string): Promise<void> {
        if (!this.connection) {
            const url = `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`;
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(queueName, {
                durable: true
            })
            console.log(`Conectado ao RabbitMQ}`);
        }
    }

    public getChannel(): Channel {
        return this.channel;
    }

    async closeConnection(): Promise<void> {
        if (this.connection){
            await this.connection.close();
            console.log("Conexão com o RabbitMQ encerrada!");
            this.connection = null;
            this.channel = null;
        }
    }
}