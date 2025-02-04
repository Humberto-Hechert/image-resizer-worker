import sharp from "sharp";
import s3 from "../config/awsConfig";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

interface ImageData {
    fileName: string;
    location: string;
    bucket: string;
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}

export async function processImage(imageData: ImageData): Promise<string> {
    try {
        console.log(`BAIXANDO IMAGEM DO BUCKET DE IMAGENS ORIGINAIS: ${imageData.fileName}`)

        const getObject = new GetObjectCommand({
            Bucket: imageData.bucket,
            Key: imageData.fileName
        })

        const responseS3 = await s3.send(getObject);

        if (!responseS3.Body) throw new Error("Imagem vazia!");

        const imageBuffer = await streamToBuffer(responseS3.Body as NodeJS.ReadableStream);

        console.log("Processando a Imagem...")

        const processedImage = await sharp(imageBuffer)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toBuffer();

        const processedFileName = `processed/${imageData.fileName}`
        const params = {
            Bucket: process.env.AWS_BUCKET_PROCESSED,
            Key: processedFileName,
            Body: processedImage,
            ContentType: "image/jpeg"
        }

        const sendObject = new PutObjectCommand(params);
        await s3.send(sendObject);

        console.log(`IMAGEM PROCESSADA E SALVA NO BUCKET - ${processedFileName}`)
        return processedFileName;

    } catch (err) {
        console.error("Erro no processamento da imagem: ", err);
        throw err;
    }
}
