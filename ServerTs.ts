//import { GetBalanceNow } from "./SolanaScripts/CheckBalance.js"
import { GetBalance, TransferSol, AirDropSol, GetTransactionLogs } from './Scripts/Transactions'
import { GenerateWallets } from './FileSystemWalletHandler'
import WebSocket from 'ws';
import { mainfn } from "./Scripts/TokenProgram";


//import { MintCustomSPLToken } from './Scripts/TokenTx';
//import { NewMintCustomSPLToken } from "./Tokens/NewMintSPLTokens.ts";
/*var transactions = createRequire("./SolanaScripts/Transactions.ts")
//var fileSystemHandler = createRequire("./Wallets/FileSystemWalletHandler.ts")
var burnSPLToken = createRequire("./Tokens/BurnSPLTokens.js")
var mintSPLToken = createRequire("./Tokens/MintSPLToken.js")*/


async function StartServer(portListen: any) {

    const wss = new WebSocket.Server({ port: portListen }, () => {
        console.log('server started')
    })
    wss.on('connection', function connection(ws) {
        ws.on('message', (data) => {
            console.log('data received \n %o', data.toString())
            HandleData(data.toString(), ws);

        })
    })
    wss.on('listening', () => {
        console.log('listening on' + portListen)

    })
}

//#region HandleData
async function HandleData(clientData: any, ws: any) {
    const obj = JSON.parse(clientData)

    if (obj.tag == "onGameCreate") {
        console.log("Entered here")
        console.log(obj.tag);

        const gameData = JSON.parse(obj.value);
        const gameName = gameData.gameName;
        const symbol = gameData.symbol;
        const gameDescription = gameData.gameDescription;
        const gameImage = 'https://bafkreiht3v7a56lwqtt43bosqhuibfga5257camhvbjoenjcc737bd4rwa.ipfs.nftstorage.link/';
        const external_url = gameData.external_url;

        console.log(gameData.name.toString());
        ws.send(ConvertToJsonOnGameCreated(await GenerateWallets(gameData.name.toString())));
    }

    if (obj.tag == "getBalance") {
        //GetBalance(obj.walletAddress, 0);
    }
    if (obj.tag == "getTransactionLogs") {
        // transactions.GetTransactionLogs(obj.accountAddress, netType, transactionHistory);
    }
    if (obj.tag == "getParsedTransaction") {
        // transactions.GetParsedTransaction(obj.transactionid, netType)
    }
    if (obj.tag == "mintSPLTokens") {
        //  mintSPLToken.MintSPLTokens(obj.walletAddress, obj.amount, obj.gameName, netType);
    }
    if (obj.tag == "burnSPLTokens") {
        //burnSPLToken.BurnSPLTokens(obj.tokenAddress,obj.amount,obj.gameName,netType);
    }
    if (obj.tag == "pingWallets") {
        //pass wallets for ping wallet fn.
        //returns bools.
        //Send it to game and update the status.
    }
}
//#endregion

//transactions.AirDropSol("4YXUfpzBBXGXQcG9to3yRsVn2jHtzfnXZsGaqcVSscES", , 0)
function ConvertToJsonOnGameCreated(obj: any) {
    return JSON.stringify({
        tag: obj.TAG,
        storeWalletAddress: obj.StoreWalletAddress,
        mintWalletAddress: obj.MintWalletAddress,
        buyinWalletAddress: obj.BuyinWalletAddress,
        tournamentWalletAddress: obj.TournamentWalletAddress,
        treasuryWalletAddress: obj.TreasurywalletAddress
    }

    )
}


//#region  pingWallets
/*async function PingWallets(gameName, StoreWalletAddress, MintWalletAddress, BuyinWalletAddress, TournamentWalletAddress) {
    var storeWallet = await fileSystemHandler.LoadWalletFromJson(gameName, StoreWalletAddress, "Store");
    var mintWallet = await fileSystemHandler.LoadWalletFromJson(gameName, MintWalletAddress, "Mint");
    var buyinWallet = await fileSystemHandler.LoadWalletFromJson(gameName, BuyinWalletAddress, "Buyin");
    var tournamentWallet = await fileSystemHandler.LoadWalletFromJson(gameName, TournamentWalletAddress, "Tournament");
    if (StoreWalletAddress == storeWallet.publicKey.toString()) {
        console.log("Store wallet Address Matched");
    } else {
        console.log("Store wallet Address Not Matched");
        var StorePing = false;
    }

    if (MintWalletAddress == mintWallet.publicKey.toString()) {
        console.log("Mint wallet Address Matched");
    } else {
        console.log("Mint wallet Address Not Matched");
        var MintPing = false;
    }

    if (BuyinWalletAddress == buyinWallet.publicKey.toString()) {
        console.log("Buyin wallet Address Matched");
    } else {
        console.log("Buyin wallet Address Not Matched");
        var BuyinPing = false;
    }

    if (TournamentWalletAddress == tournamentWallet.publicKey.toString()) {
        console.log("Tournament wallet Address Matched");
    } else {
        console.log("Tournament wallet Address Not Matched");
        var TournamentPing = false;
    }

    return {
        StorePing: StorePing,
        MintPing: MintPing,
        BuyinPing: BuyinPing,
        TournamentPing: TournamentPing
    }
}*/

StartServer(8080);
//#endregion
/*







  }
     */


//PingWallets("VORLD", "67foq9KbQs9vDyog3ZMeAP7ByCUKF8WSwa49QhrsT3dr", "4YXUfpzBBXGXQcG9to3yRsVn2jHtzfnXZsGaqcVSscES", "J5pwM1G9xLTZXv73YzQZPmt2DL24fThRr7GhDhJzAE7n", "76heasFpqkScsavAZqDTN19poYuAQzg7ZnuGsYWJbzFu");
//GetTransactionLogs("8EkFuUE8PVbi5sPk3iPLapU5p7PfNRtsLc2wXHwcEM51", 2, 50);
//transactions.GetParsedTransactionsData("JcJpNQJtmfgY5ZRZ6TG5BxBvEkwWzL3CuF6HefeogFDDKPNjdxHCz41Sj9miH9LpDM1aeU38h7tyHxkqGH33yNt",2)

//GetBalance("BEZhPh7cv1w1ermJmrXdCL8VWzwdDpLh7Bb1s1wmg8L7", 0);

//GetBalance("XyQMBPGAs5hrcVAGzt3rVTy2ZRqYvPkKGvNuWnsVWi1", 0);
//AirDropSol("BEZhPh7cv1w1ermJmrXdCL8VWzwdDpLh7Bb1s1wmg8L7", 1, 0);
//TransferSol("AwFe4jPeSeK3bF6bmCbBNVfEg8eBMT5FsvNnLQFLT8kq", "8EkFuUE8PVbi5sPk3iPLapU5p7PfNRtsLc2wXHwcEM51", 0.51, 0);
//GenerateWallets("WAKES_UP");
//fileSystemHandler.LoadWalletFromJson("VORLD", "67foq9KbQs9vDyog3ZMeAP7ByCUKF8WSwa49QhrsT3dr", "Store");
//console.log(fileSystemHandler.GetWalletData("VORLD", "67foq9KbQs9vDyog3ZMeAP7ByCUKF8WSwa49QhrsT3dr", "Store"));
//burnSPLToken.LoadWalletFromJson("./Wallets/GameBasedWallets/VORLD/Store/5ujV5ABk6g7ABdbnCUTTmXstaCkCccw9fXpkQr6tpNWk.json","");
//burnSPLToken.BurnTokenFromWallet("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr", 10, "67foq9KbQs9vDyog3ZMeAP7ByCUKF8WSwa49QhrsT3dr", "Store", "VORLD", 0);

//GetBalanceNow("4YXUfpzBBXGXQcG9to3yRsVn2jHtzfnXZsGaqcVSscES", 0);
//MintCustomSPLToken("DIGITAL", "VLD_D", "Crafting the future of VORLD one step at a time", "Images/SolanaToken.png", 0, null, null, null, 3, 1, "WAKES_UP", "XyQMBPGAs5hrcVAGzt3rVTy2ZRqYvPkKGvNuWnsVWi1", "AwFe4jPeSeK3bF6bmCbBNVfEg8eBMT5FsvNnLQFLT8kq", "AwFe4jPeSeK3bF6bmCbBNVfEg8eBMT5FsvNnLQFLT8kq", "AwFe4jPeSeK3bF6bmCbBNVfEg8eBMT5FsvNnLQFLT8kq", 0);

mainfn("WAKES_UP", "XyQMBPGAs5hrcVAGzt3rVTy2ZRqYvPkKGvNuWnsVWi1");
//MintTokenUsingMetaplex("DIGITAL", "VLD_D", "Crafting the future of VORLD one step at a time", "Images/SolanaToken.png", 0, null, null, null, 3, 1, "WAKES_UP", "XyQMBPGAs5hrcVAGzt3rVTy2ZRqYvPkKGvNuWnsVWi1", "BEZhPh7cv1w1ermJmrXdCL8VWzwdDpLh7Bb1s1wmg8L7", "AwFe4jPeSeK3bF6bmCbBNVfEg8eBMT5FsvNnLQFLT8kq", "AwFe4jPeSeK3bF6bmCbBNVfEg8eBMT5FsvNnLQFLT8kq", 0);

