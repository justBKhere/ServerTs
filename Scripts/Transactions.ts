

import { Transaction, SystemProgram, Keypair, Connection, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from "@solana/web3.js";
const RPCdevnet = 'https://api.devnet.solana.com';
const RPCtestnet = 'https://api.testnet.solana.com';
const RPCmainnetbeta = 'https://api.mainnet-beta.solana.com';

const SOLANA_CONNECTION_DEVNET = new Connection(RPCdevnet);
const SOLANA_CONNECTION_TESTNET = new Connection(RPCtestnet);
const SOLANA_CONNECTION_MAINNET_BETA = new Connection(RPCmainnetbeta);


const connectionSetting = [SOLANA_CONNECTION_DEVNET, SOLANA_CONNECTION_TESTNET, SOLANA_CONNECTION_MAINNET_BETA]

const AIRDROP_AMOUNT = 1 * LAMPORTS_PER_SOL;




export async function GetBalance(walletAddress: string, netType: number) {
    let balance = await connectionSetting[netType].getBalance(new PublicKey(walletAddress));

    console.log('WalletBalance:' + balance / LAMPORTS_PER_SOL)
}

export async function TransferSol(fromWalletAddress: string, toWalletAddress: string, sol: number, netType: number) {
    const from = Keypair.generate();
    console.log(from);
    await AirDropSol(from.publicKey, sol, 0);

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: new PublicKey(toWalletAddress),
            lamports: sol * LAMPORTS_PER_SOL,
        }),

    );
    console.log(transaction)
    const signature = await sendAndConfirmTransaction(
        connectionSetting[netType], transaction, [from],
    );
    console.log('Signature', signature);
}

export async function AirDropSol(walletAddress: any, sol: number, netType: number) {
    console.log(`requesting airdrop of ${AIRDROP_AMOUNT} for ${walletAddress}`)
    const signature = await connectionSetting[netType].requestAirdrop(new PublicKey(walletAddress), sol * LAMPORTS_PER_SOL);

    const { blockhash, lastValidBlockHeight } = await connectionSetting[netType].getLatestBlockhash();
    // 3 - Confirm transaction success
    await SOLANA_CONNECTION_DEVNET.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
    }, 'finalized');
    // 4 - Log results
    console.log(`Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    GetBalance(walletAddress, netType);

}


export async function GetTransactionLogs(walletAddress: string, netType: number, numTx: any) {
    const pubkey = new PublicKey(walletAddress);
    let transactionList: any
    switch (netType) {
        case 0:
            transactionList = await SOLANA_CONNECTION_DEVNET.getSignaturesForAddress(pubkey, { limit: numTx });
            break;
        case 1:
            transactionList = await SOLANA_CONNECTION_TESTNET.getSignaturesForAddress(pubkey, { limit: numTx });
            break;
        case 2:
            transactionList = await SOLANA_CONNECTION_MAINNET_BETA.getSignaturesForAddress(pubkey, { limit: numTx });
            break;
    }


    transactionList.forEach((transaction: any, i: number) => {
        const date = new Date(transaction.blockTime * 1000);
        console.log(`transaction number: ${i + 1}`);
        console.log(`Signature: ${transaction.signature}`);
        console.log(`Time: ${date}`);
        console.log(`Status: ${transaction.confirmationStatus}`);
        console.log((`_`).repeat(20));

    })
}

