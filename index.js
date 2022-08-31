// in Nodejs require()
// in front end javascript you can't use require
// import

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = balance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum != "undefined") {
        // console.log("I see a Metamask!");
        await window.ethereum.request({ method: "eth_requestAccounts" })
        // console.log("Connected!");
        // document.getElementById("connectButton").innerHTML = "Connected!"
        connectButton.innerHTML = "Connected!"
    } else {
        // console.log("No Metamask!");
        // document.getElementById("connectButton").innerHTML =
        //     "Please install metamask"
        connectButton.innerHTML = "Please install metamask"
    }
}

// fund function
async function fund() {
    // const ethAmount = "0.1"
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum != "undefined") {
        // provider / connection to the blockchain
        // signer / waller / someone with gas
        // contract that we are interacting with
        // ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            // now we can leverage transactions as we were doing with Node.js on the backend side
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // listen for the tx to be mined
            // wait for this tx to be finished
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise()
    // create a listener
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function balance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        const ethValue = ethers.utils.formatEther(balance)
        console.log(`The contract balance is ${ethValue} ETH`)
    }
}

// withdraw function
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.cheaperWithdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}
