import { NextApiRequest } from "next";
import { NextApiResponse } from "next/types";
import formidable from "formidable";
import fs from "fs";
import { uploadImage } from "../../src/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  const form = formidable({ multiples: true });

  const formData = await new Promise<{
    fields: formidable.Fields;
    files: formidable.Files;
  }>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
      }
      resolve({ fields, files });
    });
  });

  const { fields, files } = formData;

  const id = fields.id as string;
  const file = files.file as formidable.File;

  if (!file || !id) {
    res.status(400).json(false);
    return;
  }

  const stream = fs.createReadStream(file.filepath);
  await uploadImage(id, stream);

  res.status(200).json(true);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
