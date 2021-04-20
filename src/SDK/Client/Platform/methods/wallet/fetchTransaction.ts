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
export async function fetchTransaction(this: Platform, id: string): Promise<any> {
  // @ts-ignore
  const transaction = await this.client.getWalletAccount().getTransaction(id);

  return {
    hex: transaction,
    height: 1,
  };
}

export default fetchTransaction;
