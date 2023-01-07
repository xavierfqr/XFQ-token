import type { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { contractAddress } from '../../../helpers/constant';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  const chain = EvmChain.ETHEREUM;
  const response = await Moralis.EvmApi.token.getTokenTransfers({
    address: contractAddress,
    chain,
  });

  console.log(response.toJSON());
  res.status(200).json({ name: 'John Doe' });
  //   res.status(200).json(response.toJSON());
}
