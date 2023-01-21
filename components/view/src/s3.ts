import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const client = new S3Client({
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_SECRET,
  },
});

// eslint-disable-next-line import/prefer-default-export
export const uploadImage = async (key: string, body: fs.ReadStream) => {
  await client.send(
    new PutObjectCommand({
      Bucket: "aerial-challenge",
      Key: key,
      Body: body,
    })
  );

  return `https://${process.env.AWS_S3_HOST}/${key}`;
};
