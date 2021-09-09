import React, { useEffect, useState } from 'react'
import { invoke } from '@forge/bridge'
import { ec as EC } from 'elliptic'
import { Sdk, MetaMaskWalletProvider } from 'etherspot'
import { SXContractComponent } from '@nftaftermarket/superxerox2'
import '@nftaftermarket/superxerox2/dist/index.css'

var sdk

function App() {
  const [data, setData] = useState(null)

  useEffect(async () => {
    if (!MetaMaskWalletProvider.detect()) {
      console.log('MetaMask not detected')
      return
    }

    const walletProvider = await MetaMaskWalletProvider.connect()

    const sdk = new Sdk(walletProvider)

    console.info('SDK created')
    /*
    sdk
      .signMessage({
        message:
          'deserunt aliqua mollit ullamco sit aliquip enim in laboris do',
      })
      .then(console.log)
      */
    sdk.getGatewayGasInfo().then(console.log)
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

const App2 = () => {
  return <SXContractComponent text="DApp 🚀" />
}

export default App2
