import React, { useEffect, useState } from 'react'
import { invoke } from '@forge/bridge'
import { ec as EC } from 'elliptic'
import { Sdk, NetworkNames } from 'etherspot';

let sdk

function App() {
  const [data, setData] = useState(null)

  useEffect(async () => {
    sdk = new Sdk('0x492a0ed9e5f29e9491ad4893f16634cfc50facac1d23d6035319b708f0023acc', {
      networkName: 'matic',
    });
    console.log('sdk',sdk)
    const signature = await sdk.signMessage({
      message: 'asdf',
    });
  
    console.log('signature', signature);



    const ec = new EC('secp256k1')
    var key = await ec.genKeyPair()
    console.info('key', key)
    var msgHash = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    var signature2 = await key.sign(msgHash)
    console.info('sign', signature2)
    invoke('getText', { example: 'my-invoke-variable' }).then(setData)
    
  }, [])

  return <div>{data ? data : 'Loading...'}</div>
}

export default App
