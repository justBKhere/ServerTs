

/**
 * This script will generate a new .json secret key to guideSecret.json and log your wallet addres and airdrop tx Id.
 * 
 * First Update endpoint with your QuickNode HTTP Url from quicknode.com/endpoints.
 * Run ts-node wallet.ts
 * This script will perform 4 tasks: 
 * 1. Connect to the Solana Network (Make sure you replace `endpoint` with your Quicknode Endpoint URL).
 * 2. Generate a new Wallet Keypair.
 * 3. Write the Secret Key to a .json file. Format the key as an array of numbers. Use `fs` to export the array to a `.json` file.
 * 4. Airdrop 1 SOL to the newly created wallet. (note: this will only work on dev and test nets)  
 */
//var cryptoJS = require("crypto-js")
//var AES = require("crypto-js/aes")


import { Transaction, SystemProgram, Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { GetBalance, TransferSol, AirDropSol, GetTransactionLogs } from './Scripts/Transactions'
import * as  fs from 'fs';


const RPCdevnet = 'https://api.devnet.solana.com';
const RPCtestnet = 'https://api.testnet.solana.com';
const RPCmainnetbeta = 'https://api.mainnet-beta.solana.com';

const SOLANA_CONNECTION_DEVNET = new Connection(RPCdevnet);
const SOLANA_CONNECTION_TESTNET = new Connection(RPCtestnet);
const SOLANA_CONNECTION_MAINNET_BETA = new Connection(RPCmainnetbeta);


const connectionSetting = [SOLANA_CONNECTION_DEVNET, SOLANA_CONNECTION_TESTNET, SOLANA_CONNECTION_MAINNET_BETA]



const storageFilePath = "./Wallets/GameBasedWallets/"


export async function GetWalletFilePath(gameName: string, walletAddress: string, walletType: string) {


    var FilePaath: fs.PathLike = storageFilePath + gameName + "/" + walletType + "/" + walletAddress + ".json";
    console.log(FilePaath);
    return FilePaath;
}

export async function GetWalletData(gameName: string, walletAddress: string, walletType: string) {
    return LoadWalletFromJson(gameName, walletAddress, walletType);
}

export async function LoadWalletFromJson(gameName: string, walletAddress: string, walletType: string) {
    var fileLocation: string = await GetWalletFilePath(gameName, walletAddress, walletType);
    const SECRET = JSON.parse(fs.readFileSync(fileLocation).toString());
    const secretKey = Uint8Array.from(SECRET);

    //console.log(`this is store wallet secret ${secretKey}`);
    const WALLET = Keypair.fromSecretKey(new Uint8Array(secretKey));

    //console.log(WALLET.publicKey.toString());
    return WALLET;
}


export async function GenerateWallets(gameName: string) {
    var storeWalletAddress = await generateStoreWallet(gameName);
    var mintWalletAddress = await generateMintWallet(gameName);
    var buyinWalletAddress = await generateBuyinWallet(gameName);
    var tournamentWalletAddress = await generateTournamentWallet(gameName);
    var treasuryWalletAddress = await generateTreasuryWallet(gameName);

    DepositSolToAllWallets(storeWalletAddress, mintWalletAddress, buyinWalletAddress, tournamentWalletAddress, treasuryWalletAddress);
    console.log(`storewalletAddress: ${storeWalletAddress}, mintwalletAddress: ${mintWalletAddress}, buyinWalletAddress: ${buyinWalletAddress}, tournamentWalletAddress: ${tournamentWalletAddress}, treasuryWalletAddress: ${treasuryWalletAddress}`);

    return {
        TAG: "OnGameCreated",
        StoreWalletAddress: storeWalletAddress,
        MintWalletAddress: mintWalletAddress,
        BuyinWalletAddress: buyinWalletAddress,
        TournamentWalletAddress: tournamentWalletAddress,
        TreasurywalletAddress: treasuryWalletAddress
    }

}




//------------------------------------ Store wallet related code------------------------------------------

async function DepositSolToAllWallets(storeWalletAddress: string, mintwalletAddress: string, buyinWalletAddress: string, tournamentWalletAddress: string, treasuryWalletAddress: string) {
    await AirDropSol(mintwalletAddress, 1, 0);
    await AirDropSol(buyinWalletAddress, 1, 0);
    await AirDropSol(tournamentWalletAddress, 1, 0);
    await AirDropSol(storeWalletAddress, 1, 0);
    await AirDropSol(treasuryWalletAddress, 1, 0);
}
async function generateStoreWallet(gameName: string) {

    //Generate a New Solana Wallet
    const keypair = Keypair.generate();
    console.log(`Generated new KeyPair. Wallet PublicKey:`, keypair.publicKey.toString());

    //Write Wallet Secret Key to a .JSON
    const secret_array = keypair.secretKey
        .toString() //convert secret key to string
        .split(',') //delimit string by commas and convert to an array of strings
        .map(value => Number(value)); //convert string values to numbers inside the array

    const secret = JSON.stringify(secret_array);
    console.log(`this is store wallet secret ${secret}`);

    /*  //need a better way to encrypt look inot this for production
      const secretEncrypted = cryptoJS.AES.encrypt(secret,gameName+'826214');
      console.log(`this is secretencrypted: ${secretEncrypted}`);
      const secretDecrypted = cryptoJS.AES.decrypt(secretEncrypted, gameName+'826214');
      console.log(`this is secretdecrypted: ${secretDecrypted}`);*/


    var storewalletAddress = await StoreStoreWallet(gameName, keypair, secret)
    return storewalletAddress


}



async function StoreStoreWallet(gameName: string, keypair: Keypair, secretEncrypted: string) {
    var dir = storageFilePath + gameName;
    fs.mkdirSync(dir)
    var storedir = dir + '/Store';
    fs.mkdirSync(storedir)
    fs.writeFile(storedir + '/' + keypair.publicKey.toString() + '.json', secretEncrypted, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote secret key to json.');
    });
    return keypair.publicKey.toString()
}


//--------------------------------- Minting waller related code-------------------------------------------

async function generateMintWallet(gameName: string) {
    const keypair = Keypair.generate();
    console.log("Generated new keypair mint wallet public key:", keypair.publicKey.toString());

    const secret_array = keypair.secretKey
        .toString()
        .split(',')
        .map(value => Number(value));

    const secret = JSON.stringify(secret_array);
    console.log(`This is Mint wallet secret ${secret}`);

    var mintwalletAddress = await Mintwallet(gameName, keypair, secret)
    return mintwalletAddress
}


async function Mintwallet(gameName: string, keypair: Keypair, secretEncrypted: string) {
    var dir = storageFilePath + gameName
    var mintdir = dir + '/Mint';
    fs.mkdirSync(mintdir)
    fs.writeFile(mintdir + '/' + keypair.publicKey.toString() + '.json', secretEncrypted, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote secret key to json.');
    });
    return keypair.publicKey.toString()
}

//--------------------------------- Buyin wallet related code-------------------------------------------

async function generateBuyinWallet(gameName: string) {
    const keypair = Keypair.generate();
    console.log("Generated new keypair buyin wallet public key:", keypair.publicKey.toString());

    const secret_array = keypair.secretKey
        .toString()
        .split(',')
        .map(value => Number(value));

    const secret = JSON.stringify(secret_array);
    console.log(`This is Buyin wallet secret ${secret}`);

    var buyinwalletAddress = await Buyinwallet(gameName, keypair, secret)
    return buyinwalletAddress
}


async function Buyinwallet(gameName: string, keypair: Keypair, secretEncrypted: string) {
    var dir = storageFilePath + gameName
    var mintdir = dir + '/Buyin';
    fs.mkdirSync(mintdir)
    fs.writeFile(mintdir + '/' + keypair.publicKey.toString() + '.json', secretEncrypted, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote secret key to json.');
    });
    return keypair.publicKey.toString()
}

//--------------------------------- Tournament wallet related code-------------------------------------------

async function generateTournamentWallet(gameName: string) {
    const keypair = Keypair.generate();
    console.log("Generated new keypair tournament wallet public key:", keypair.publicKey.toString());

    const secret_array = keypair.secretKey
        .toString()
        .split(',')
        .map(value => Number(value));

    const secret = JSON.stringify(secret_array);
    console.log(`This is Tournament wallet secret ${secret}`);

    var tournamentwalletAddress = await Tournamentwallet(gameName, keypair, secret)
    return tournamentwalletAddress
}


async function Tournamentwallet(gameName: string, keypair: Keypair, secretEncrypted: string) {
    var dir = storageFilePath + gameName
    var mintdir = dir + '/Tournament';
    fs.mkdirSync(mintdir)
    fs.writeFile(mintdir + '/' + keypair.publicKey.toString() + '.json', secretEncrypted, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote secret key to json.');
    });
    return keypair.publicKey.toString()
}

//--------------------------------- Treasury wallet related code-------------------------------------------

async function generateTreasuryWallet(gameName: string) {
    const keypair = Keypair.generate();
    console.log("Generated new keypair Treasury wallet public key:", keypair.publicKey.toString());

    const secret_array = keypair.secretKey
        .toString()
        .split(',')
        .map(value => Number(value));

    const secret = JSON.stringify(secret_array);
    console.log(`This is Treasury wallet secret ${secret}`);

    var tournamentwalletAddress = await Treasurywallet(gameName, keypair, secret)
    return tournamentwalletAddress
}


async function Treasurywallet(gameName: string, keypair: Keypair, secretEncrypted: string) {
    var dir = storageFilePath + gameName
    var mintdir = dir + '/Treasury';
    fs.mkdirSync(mintdir)
    fs.writeFile(mintdir + '/' + keypair.publicKey.toString() + '.json', secretEncrypted, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote secret key to json.');
    });
    return keypair.publicKey.toString()
}
