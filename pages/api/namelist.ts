import path from 'path';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonDirectory = path.join(process.cwd(), 'file');

  const fileBuffer = fs.readFileSync(jsonDirectory + '/namelist.csv', {
    encoding: 'utf-8',
  });

  res.setHeader('Content-Type', 'text/csv');
  res.status(200).send(fileBuffer);
}
