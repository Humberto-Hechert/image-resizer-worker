import RabbitMqConfig from "./config/rabbitMq";
import dotenv from 'dotenv';
dotenv.config();

async function startWorker() {
    const queueOriginalImage = String(process.env.QUEUE_ORIGINAL_IMAGE);
    const rabbitMq = new RabbitMqConfig();
    await rabbitMq.connect(queueOriginalImage);
    const channel = rabbitMq.getChannel();

    if (!channel) {
        console.log("Erro ao obter canal do RabbitMQ");
        return;
    }

    console.log("WORKER INICIADO");
    channel.consume(queueOriginalImage, (msg) => {
        if (msg) {
            try {
                const message = JSON.parse(msg.content.toString());
                console.log(`Mensagem consumida!\nConteudo: ${JSON.stringify(message)}`);
                channel.ack(msg);
            } catch (err) {
                console.error("Erro ao processar mensagem: ", err);
                channel.nack(msg);
            }
        }
    })
}

startWorker();