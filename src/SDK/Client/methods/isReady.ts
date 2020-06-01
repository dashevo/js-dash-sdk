/**
 * Check if this instance state is reported ready
 *
 * @param this bound class instance
 * @returns true only if this is ready
 */
async function isReady(this: any) {
    const {state, account} = this;
    if (state.isAccountReady) {
        return true;
    };
    let promises: Promise<boolean>[] = []
    if(!state.isAccountReady && account){
        // @ts-ignore
        promises.push(account.isReady());
    }

    await Promise.all(promises);
    return true;
}
export default isReady;
