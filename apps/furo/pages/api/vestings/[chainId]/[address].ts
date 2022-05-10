import type { NextApiRequest, NextApiResponse } from 'next'
import { getVestings } from '../../../../graph/graph-client'
import { VestingRepresentation } from 'features/context'

export type Vestings = { incomingVestings: VestingRepresentation[]; outgoingVestings: VestingRepresentation[] }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, address } = req.query
  const vestings = (await getVestings(chainId as string, address as string)) as Vestings
  res.status(200).send(vestings)
}
