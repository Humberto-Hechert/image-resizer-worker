
# Image Resizer Producer

Este projeto implementa um sistema de processamento assíncrono de imagens, utilizando Node.js, RabbitMQ, Amazon S3 e a biblioteca Sharp. Ele permite que imagens enviadas pelos usuários sejam processadas em segundo plano, melhorando a experiência do usuário e a escalabilidade da aplicação. Este repositório contém somente o o worker (consumidor) dos dados das mensagens na fila do RabbitMQ enviadas pela aplicação "image-resizer" (producer)


## Instalação

Clone o repositório

```bash
    git clone https://github.com/Humberto-Hechert/image-resizer-worker
    cd image-resizer-worker
```
Instale as dependências

```bash
    npm install
```
Configure as variáveis de ambiente
```bash
    AWS_ACCESS_KEY_ID=seu-access-key-da-AWS
    AWS_SECRET_ACCESS_KEY=seu-secret-key-da-AWS
    AWS_REGION=regiao-da-aws-que-utiliza
    AWS_BUCKET_NAME=nome-do-seu-bucket-para-imagem-original
    AWS_BUCKET_PROCESSED=nome-do-seu-bucket-para-imagem-processada

    RABBIT_HOST=localhost
    RABBIT_PORT=5672
    RABBIT_USER=seu-usuario-do-rabbitmq
    RABBIT_PASS=sua-senha-do-rabbitmq
    QUEUE_ORIGINAL_IMAGE=nome-da-sua-fila-no-rabbitmq
```
Inicie a aplicação localmente
```bash
    npm run dev
```
