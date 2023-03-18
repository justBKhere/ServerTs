import { Transaction, SystemProgram, Keypair, Connection, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import {
    PROGRAM_ID as MPL_TOKEN_METADATA_PROGRAM_ID,
    createCreateMetadataAccountV2Instruction,
    createCreateMasterEditionV3Instruction, Key
} from '@metaplex-foundation/mpl-token-metadata';
import { bundlrStorage, mockStorage, findMetadataPda, toMetaplexFile, keypairIdentity, Metaplex, UploadMetadataInput } from '@metaplex-foundation/js';
import { GetWalletData } from '../FileSystemWalletHandler';
import * as  fs from 'fs';
import { Buffer } from 'buffer'



const RPCdevnet = 'https://api.devnet.solana.com';
const RPCtestnet = 'https://api.testnet.solana.com';
const RPCmainnetbeta = 'https://api.mainnet-beta.solana.com';

const SOLANA_CONNECTION_DEVNET = new Connection(RPCdevnet);
const SOLANA_CONNECTION_TESTNET = new Connection(RPCtestnet);
const SOLANA_CONNECTION_MAINNET_BETA = new Connection(RPCmainnetbeta);

const endpointSetting = [RPCdevnet, RPCtestnet, RPCmainnetbeta];
const connectionSetting = [SOLANA_CONNECTION_DEVNET, SOLANA_CONNECTION_TESTNET, SOLANA_CONNECTION_MAINNET_BETA]

function MintWalletKeyPair(gameName: string, walletAddress: string, walletType: string) {
    return GetWalletData(gameName, walletAddress, "Mint");

}




export async function mainfn(gameName: any, mintWalletAddress: any) {

    const mintWallet: any = await MintWalletKeyPair(gameName, mintWalletAddress, "Mint");
    console.log(mintWallet);

    const QUICKNODE_RPC = 'https://dry-sly-seed.solana-devnet.discover.quiknode.pro/1ab80a3ec0dad344ebb1db48f99421ce5bc4dd29/';
    const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

    const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
        .use(keypairIdentity(mintWallet))
        .use(bundlrStorage({
            address: 'https://devnet.bundlr.network',
            providerUrl: QUICKNODE_RPC,
            timeout: 60000,
        }));

    const CONFIG = {
        uploadPath: 'uploads/',
        imgFileName: 'iMAGE.png',
        imgType: 'image/png',
        imgName: 'QuickNode Pixel',
        description: 'Pixel infrastructure for everyone!',
        attributes: [
            { trait_type: 'Speed', value: 'Quick' },
            { trait_type: 'Type', value: 'Pixelated' },
            { trait_type: 'Background', value: 'QuickNode Blue' }
        ],
        sellerFeeBasisPoints: 500,//500 bp = 5%
        symbol: 'QNPIX',
        creators: [
            { address: mintWallet.publicKey, share: 100 }
        ]
    };
    console.log(`Minting ${CONFIG.imgName} to an NFT in Wallet ${mintWallet.publicKey.toBase58()}.`);
    const imgUri = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName, METAPLEX);
    //Step 2 - Upload Metadata
    const metadataUri = await uploadMetadata(imgUri, CONFIG.imgType, CONFIG.imgName, CONFIG.description, CONFIG.attributes, METAPLEX);
    console.log(`Metadata URI: ${metadataUri}`);
}
async function uploadImage(filePath: string, fileName: string, METAPLEX: any): Promise<string> {
    console.log(`Step 1 - Uploading Image`);
    const imgBuffer = fs.readFileSync(filePath + fileName);
    const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
    const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
    console.log(`   Image URI:`, imgUri);
    return imgUri;
}

async function uploadMetadata(imgUri: string, imgType: string, nftName: string, description: string, attributes: { trait_type: string, value: string }[], METAPLEX: any) {
    console.log(`Step 2 - Uploading Metadata`);
    const { uri } = await METAPLEX
        .nfts()
        .uploadMetadata({
            name: nftName,
            description: description,
            image: imgUri,
            attributes: attributes,
            properties: {
                files: [
                    {
                        type: imgType,
                        uri: imgUri,
                    },
                ]
            }
        });
    console.log('   Metadata URI:', uri);
    return uri;
}