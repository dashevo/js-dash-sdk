import {Platform} from "../../Platform";

/**
 * Fetch wallet by id
 *
 * @param {Platform} this - bound instance class
 * @param {string} id - id
 * @returns {
 *   hex: string,
 *   height: number,
 * }
 */
export async function fetchLatestPlatformBlockHeader(this: Platform, id: string): Promise<any> {
  // @ts-ignore
  const coreChainLockedHeight = await this.client.wallet.transport.getBestBlockHeight();

  return {
    coreChainLockedHeight,
  };
}

export default fetchLatestPlatformBlockHeader;
