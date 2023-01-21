import { NextApiRequest } from "next";
import { NextApiResponse } from "next/types";
import { deleteImage } from "../../src/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  const { id } = req.body;

  await deleteImage(id);

  res.status(200).json(true);
}
