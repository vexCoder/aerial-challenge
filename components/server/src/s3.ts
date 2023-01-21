import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_SECRET,
  },
});

// eslint-disable-next-line import/prefer-default-export
export const getSignedUrlForSrc = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: "aerial-challenge",
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: 60 * 60 * 24 * 7,
  });
};

export const deleteImage = async (key: string) => {
  await client.send(
    new DeleteObjectCommand({
      Bucket: "aerial-challenge",
      Key: key,
    })
  );
};
