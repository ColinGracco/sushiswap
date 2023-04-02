import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'
import { Token } from '@sushiswap/currency'

import { FeeAmount, INIT_CODE_HASH } from './constants'

export const computePairAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
}): string => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return getCreate2Address(
    factoryAddress,
    keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
    INIT_CODE_HASH[token0.chainId]
  )
}


/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computeV3PoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  // initCodeHashManualOverride
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: FeeAmount
  initCodeHashManualOverride?: string
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return getCreate2Address(
    factoryAddress,
    keccak256(
      ['bytes'],
      [defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]
    ),
    // initCodeHashManualOverride ?? V3_INIT_CODE_HASH[token0.chainId]
    '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
  )
}