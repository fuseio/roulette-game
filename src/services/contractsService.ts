import { http, parseEther, formatEther, getContract, createPublicClient, Address, WalletClient, decodeEventLog } from 'viem';
import CasinoAbi from "../backend/contractsData/CasinoAbi";
import CasinoAddress from "../backend/contractsData/Casino-address";
import { fuseFlash } from '../wagmi';

const publicClient = createPublicClient({
    chain: fuseFlash,
    transport: http(),
})

const casino = (walletClient?: WalletClient) => {
    return getContract({
        address: CasinoAddress,
        abi: CasinoAbi,
        client: { public: publicClient, wallet: walletClient }
    })
}

const tokenBalance = async (account: Address) => {
    const balance = await casino().read.tokenBalance([account]);
    return parseInt(balance);
}

const buyTokens = async (tokenNum: number, price: number, walletClient: WalletClient) => {
    try {
        const tx = await casino(walletClient).write.compraTokens([tokenNum], { value: parseEther(price.toString()) });
        console.log(tx)
    } catch (error) {
        console.log(error)
    }
}

const withdrawTokens = async (tokenNum: number, walletClient: WalletClient) => {
    await casino(walletClient).write.devolverTokens([tokenNum]);
}

const playRoulette = async (start: number, end: number, tokensBet: number, walletClient: WalletClient) => {
    let receipt;
    try {
        const hash = await casino(walletClient).write.jugarRuleta([start.toString(), end.toString(), tokensBet.toString()]);

        receipt = await publicClient.waitForTransactionReceipt({ hash });

        const events = decodeEventLog({ abi: CasinoAbi, eventName: "RouletteGame", topics: receipt.logs[1].topics, data: receipt.logs[1].data })

        return {
            numberWon: parseInt(events.args.NumberWin),
            result: events.args.result,
            tokensEarned: parseInt(events.args.tokensEarned)
        }
    } catch (error) {
        console.log("error", error)

        const events2 = decodeEventLog({ abi: CasinoAbi, eventName: "RouletteGame", topics: receipt.logs[2].topics, data: receipt.logs[2].data })

        return {
            numberWon: parseInt(events2.args.NumberWin),
            result: events2.args.result,
            tokensEarned: parseInt(events2.args.tokensEarned)
        }
    }
}

const tokenPrice = async () => {
    const price = await casino().read.precioTokens([1]);
    return formatEther(price);
}

const historial = async (account: Address, walletClient: WalletClient) => {
    const historial = await casino(walletClient).read.tuHistorial([account]);
    let historialParsed = [];
    historial.map((game) => (
        historialParsed.push([game[2], parseInt(game[0]), parseInt(game[1])])
    ));
    return historialParsed;
}

export default { tokenBalance, buyTokens, tokenPrice, historial, playRoulette, withdrawTokens };





