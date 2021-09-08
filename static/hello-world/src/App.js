import React, { useEffect, useState } from 'react'
import { invoke } from '@forge/bridge'
import { ec as EC } from 'elliptic'
import { Sdk } from 'etherspot'
var sdk

function App() {
  const [data, setData] = useState(null)

  useEffect(async () => {
    sdk = new Sdk(
      {
        privateKey:
          '0xe1b02eb0239ab074b79acb3d53f3114dd54fe6f989e75b680364f8899bc34ed3',
      },
      {
        networkName: 'mainnet',
      },
    )
    const signature = await sdk.signMessage({
      message: 'deserunt aliqua mollit ullamco sit aliquip enim in laboris do',
    })
    const output = await sdk.getGatewayGasInfo()

    console.log('gateway gas info', output)

    console.log('signature', signature)


    sdk.syncAccount().then(console.log)
  
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
