import { minioClient, readableStreamFromBrowserStream } from "@/utils/minioConfig";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

interface UploadParams {
    bucketName: string;
    file: File;
    folder: string;
}

export async function uploadToMinio({ bucketName, file, folder }: UploadParams): Promise<any> {
    try {
        const originalFileName = file.name;
        const fileExtension = path.extname(originalFileName);
        const fileName = `${folder}/${uuidv4()}${fileExtension}`;
        const stream = file.stream();
        const nodeStream = await readableStreamFromBrowserStream(stream);

        const data: any = await new Promise((resolve, reject) => {
            minioClient.putObject(
                bucketName,
                fileName,
                nodeStream,
                file.size,
                { 'Content-Type': file.type },
                (err: any, etag: any) => {
                    if (err) {
                        reject(new Error('Image upload failed'));
                    } else {
                        resolve(etag);
                    }
                }
            );
        });
        return {etag: data.etag, fileName}
    } catch (error) {
        throw error;
    }
}
