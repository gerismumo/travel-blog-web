import * as Minio from 'minio';
import { Readable } from 'stream';

export const minioClient = new Minio.Client({
    endPoint: 'images.itravelholidays.co.uk',
    port: 443,
    useSSL: true,
    accessKey: '2GtFgQFtQGS4h6XmNght', // Replace with your access key
    secretKey: '3Go2RHtln7kI8pIr3M5uu7CgGr6tEQrmPJ8qanyo' // Replace with your secret key
  });
  
 export async function readableStreamFromBrowserStream(stream: any) {
    const reader = stream.getReader();
    return new Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(value);
        }
      }
    });
  }


