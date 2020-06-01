/**
 * Report account state in a fixed interval of time [100 ms]
 *
 * @param this bound class instance
 *
 * @remarks
 * isAccountReady calls isSelfReady to check report state
 */
const isAccountReady = async function(this: any): Promise<boolean>{
    const self = this;
    return new Promise((res)=>{
        let isReadyInterval = setInterval(() => {
            if (self.state.isAccountReady) {
                clearInterval(isReadyInterval);
                res(true);
            }
        }, 100);
    })
}
/**
 * Report state in a fixed interval of time [100 ms]
 *
 * @param this bound class instance
 *
 * @remarks
 * isReady calls isSelfReady to check report state
 */
const isSelfReady = async function(this: any): Promise<boolean>{
    const self = this;
    return new Promise((res)=>{
        let isReadyInterval = setInterval(() => {
            if (self.state.isReady) {
                clearInterval(isReadyInterval);
                res(true);
            }
        }, 100);
    })
}

/**
 * Check if this instance state is reported ready
 *
 * @param this bound class instance
 * @returns true only if this is ready
 */
async function isReady(this: any) {
    const {state, account, wallet} = this;
    if (state.isAccountReady && state.isReady) {
        return true;
    };
    let promises: Promise<boolean>[] = []
    if(!state.isAccountReady && state.isAccountWaiting){
        // @ts-ignore
        promises.push(isAccountReady.call(this));
    }
    if(!state.isReady){
        promises.push(isSelfReady.call(this));
    }

    await Promise.all(promises);
    return true;
}
export default isReady;
