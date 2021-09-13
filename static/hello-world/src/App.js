import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import {
  Sdk,
  Env,
  EnvNames,
  MetaMaskWalletProvider,
  NetworkNames,
  sleep,
  randomPrivateKey
} from 'etherspot'
//TransactionRequest,

import { ethers, utils } from 'ethers'
//BigNumberish

import { ContractNames } from '@etherspot/contracts'
//getContractAbi
//const erc20Abi: any = getContractAbi(ContractNames.ERC20Token);
console.log('contract name', ContractNames.ERC20Token)
//P2PPaymentChannel
const privateKeyA = randomPrivateKey()
const privateKeyB = randomPrivateKey()

var senderEtherspotUser
var receiverEtherspotUser

// change default environment
Env.defaultName = 'testnets'

function App() {const [senderAddress, setSenderAddress] = useState('👽')
const [receiverAddress, setReceiverAddress] = useState('👽')
const [p2pPaymentDepositAddress, setP2pPaymentDepositAddress] = useState('👽')
//  const [depositRec, setDepositRec] = useState('👽')
const [gas] = useState('👽')
const [hash2] = useState('👽')
const [receiver, receiverAccountInput] = useState('👽')
const [amount, amountInput] = useState('👽')
const [balance, setBalance] = useState('👽')
const [balanceR, setBalanceR] = useState('👽')

useEffect(() => {
  ;(async function run() {
    if (!MetaMaskWalletProvider.detect()) {
      console.log('MetaMask not detected')
      return
    }
    const walletProvider = await MetaMaskWalletProvider.connect()
    console.log(walletProvider)
    senderEtherspotUser = new Sdk(privateKeyA, {
      networkName: 'etherspot'
    })

    senderEtherspotUser.notifications$.subscribe(
      async (notification: any) => {
        console.log('sdk 🦋🦋🦋🦋:', notification)
        await logDeposits()
      }
    )
    console.log('state', senderEtherspotUser.state)
    console.log(senderEtherspotUser.state.p2pPaymentDepositAddress)
    receiverEtherspotUser = new Sdk(
      { privateKey: privateKeyB },
      {
        networkName: 'etherspot'
      }
    )
    await senderEtherspotUser.topUpAccount().catch(console.error)
    await receiverEtherspotUser.topUpAccount().catch(console.error)
    await senderEtherspotUser
      .topUpPaymentDepositAccount()
      .catch(console.error)
    await receiverEtherspotUser
      .topUpPaymentDepositAccount()
      .catch(console.error)
    sleep(5)
    const Senderbal = await senderEtherspotUser.getAccountBalances()

    console.log('Sender balances', Senderbal)
    setBalance(
      ethers.utils.formatEther(Senderbal.items[0].balance.toString())
    )
    console.log(Senderbal.items[0].balance.toString())
    const Rbal = await receiverEtherspotUser.getAccountBalances()

    console.log('Receiver balances', Rbal)
    console.log(Rbal.items[0].balance.toString())
    setBalanceR(ethers.utils.formatEther(Rbal.items[0].balance.toString()))

    receiverEtherspotUser.notifications$.subscribe(
      async (notification: any) => {
        console.log('rec 🦋🦋🦋🦋:', notification)
        await logDeposits()
      }
    )

    // const { p2pDepositAddress } = senderEtherspotUser.state;

    console.info('SDK created')
    const output = await senderEtherspotUser.syncAccount()
    console.log('👽 account', output.address)
    console.log(output)
    console.log('👽 sender account', output.address)
    setSenderAddress(output.address)

    const output2 = await receiverEtherspotUser.syncAccount()
    setReceiverAddress(output2.address)
    console.log(
      '👽 receiver account',
      receiverEtherspotUser.state.accountAddress
    )

    const outputx = await senderEtherspotUser.computeContractAccount()

    console.log('sender contract account', outputx)

    const outputxx = await receiverEtherspotUser.computeContractAccount()

    console.log('receiver contract account', outputxx)

    const outputSS = await senderEtherspotUser.batchDeployAccount()

    console.log('gateway batch Sender', outputSS)

    const outputRR = await receiverEtherspotUser.batchDeployAccount()

    console.log('gateway batch Receiver', outputRR)

    const { p2pPaymentDepositAddress } = senderEtherspotUser.state
    setP2pPaymentDepositAddress(p2pPaymentDepositAddress)

    await logDeposits()

    //(receiverEtherspotUser.state.p2pPaymentDepositAddress)
  })().catch(console.error)
}, [])

const logChannels = async () => {
  console.log('xx sender address', senderAddress)
  const channels1 = await senderEtherspotUser.getP2PPaymentChannels({
    senderOrRecipient: senderAddress,
    page: 1
  })
  console.log('logChannels Sender', channels1)
  const channels = await senderEtherspotUser.getP2PPaymentChannels({
    senderOrRecipient: senderAddress,
    page: 2
  })
  console.log('logChannels Sender', channels)
  const size = channels.items.length
  if (size > 0) {
  //  setHash(channels.items[size - 1].hash)
  console.log('🛰 getP2pChannels.last hash', channels.items[size - 1].hash)
  }
  console.log('xx receiver address', receiverAddress)
  const channelsR = await senderEtherspotUser.getP2PPaymentChannels({
    senderOrRecipient: receiverAddress
  })
  console.log('logChannels Receiver', channelsR)
  const sizeR = channelsR.items.length
  //setHash(channelsR.items[sizeR - 1].hash)
  if (sizeR > 0) {
    console.log(
      '🛰 getP2pChannels.last Receiver hash',
      channelsR.items[sizeR - 1].hash
    )
  }
}

const logDeposits = async () => {
  console.log(
    '🚄 getP2pPDeposits',
    await senderEtherspotUser.getP2PPaymentDeposits()
  )
  senderEtherspotUser.getP2PPaymentDeposits().then((x) => {
    console.log(
      '🚄 getP2pPDeposits.0.availableAmount',
      utils.formatUnits(x.items[0].availableAmount.toString(), 18)
    )
    console.log(
      'lockedAmount',
      utils.formatUnits(x.items[0].lockedAmount.toString(), 18)
    )
    console.log(
      'pendingAmount',
      utils.formatUnits(x.items[0].pendingAmount.toString(), 18)
    )
    if (x.items[0].latestWithdrawal) {
      console.log(
        'latestWithdrawal.value',
        utils.formatUnits(x.items[0].latestWithdrawal.value.toString(), 18)
      )
      console.log(
        'latestWithdrawal.totalAmount',
        utils.formatUnits(
          x.items[0].latestWithdrawal.totalAmount.toString(),
          18
        )
      )
    }
    console.log(
      'totalAmount',
      utils.formatUnits(x.items[0].totalAmount.toString(), 18)
    )
    console.log(
      'withdrawAmount',
      utils.formatUnits(x.items[0].withdrawAmount.toString(), 18)
    )
  })
}

return (
  <div className={styles.simple}>
    <div>
      🦋 Simple Ethereum Wallet 🦋 <p />
      To sent:{' '}
      <input
        value={amount}
        onChange={(e) => amountInput(e.target.value)}
        type='text'
      />{' '}
      ETH to Account :{' '}
      <input
        value={receiver}
        onChange={(e) => receiverAccountInput(e.target.value)}
        type='text'
      />{' '}
      <p />
       account: {senderAddress}: {balance} ETH
      <p />
      🚀 receiver account: {receiverAddress}: {balanceR} ETH
      <p /> 👻
      <p /> p2pPayment deposit address: {p2pPaymentDepositAddress} ⛽️
      estimated Gas {gas} 🦋 last hash: {hash2}
    </div>
    <button
      type='button'
      onClick={async () => {
        console.log('logger')
        await logDeposits()
        await logChannels()
      }}
    >
      📡 show logs in console
    </button>
    <button
      type='button'
      onClick={async () => {
        const recepitent =
          receiver === '' || receiver === '👽' ? receiverAddress : receiver
        console.log('send to recepitent', recepitent)

        //const amtInWei = '500000000000000000'; //Send 0.5 ETH (reverted)
        await senderEtherspotUser.clearGatewayBatch
        const batch = await senderEtherspotUser
          .batchExecuteAccountTransaction({
            to: receiverEtherspotUser.state.accountAddress, // Destination Ethereum address
            value: ethers.utils.parseEther('0.01')
          })
          .catch(console.error)
        console.log('batch numbner', batch)

        /*

        const erc20Contract: any = senderEtherspotUser.registerContract<
          ERC20Contract
        >('erc20Contract', erc20Abi, erc20Address)

        const transactionRequest = erc20Contract.encodeApprove(recepitent, 1);

        console.log('transaction request', transactionRequest)

        console.log(
          'gateway batch',
          await senderEtherspotUser.batchExecuteAccountTransaction(
            transactionRequest
          )
        )
        */

        const estimationResponse = await senderEtherspotUser
          .estimateGatewayBatch()
          .catch(console.error)

        console.log('Gas estimated at:', estimationResponse)

        const submittedBatch = await senderEtherspotUser.submitGatewayBatch()
        //.catch(console.error);

        const { hash } = submittedBatch

        await sleep(5)

        console.log(
          'submitted batch',
          await senderEtherspotUser.getGatewaySubmittedBatch({
            hash
          })
        )
      }}
    >
      📡 send ETH to receiver!
    </button>
  </div>
)
}


export default App
