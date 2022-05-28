import React, { createContext, useState, useEffect } from 'react';
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { contractAddress, abi, contractChainId } from "./constants";
import { getInflationIndex } from './utils';

export const DataContext = createContext();

const logmessage = (msg) => {
	if (window.location.hostname === 'localhost')
		console.log(msg)
}

const DataContextProvider = (props) => {
	const [lotteryId, setLotteryId] = useState("0")
	const [lotteryState, setLotteryState] = useState("0")
	const [entranceFee, setEntranceFee] = useState("0")
	const [currentPool, setCurrentPool] = useState("0")
    const [numberOfTickets, setNumberOfTickets] = useState("0")
    const [lotteryHistory, setLotteryHistory] = useState([])
	const [players, setPlayers] = useState([])

	const [inflationToday, setInflationToday] = useState(0);
	const [status, setStatus] = useState('');


	const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex);

	useEffect(() => {
        // init
        getInflationToday();
	}, [])

	useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    async function getInflationToday() {
        const today = new Date().toJSON().slice(0,10)
        const inflation = await getInflationIndex(today)
        //console.log(inflation);
        setInflationToday(inflation.yearOverYearInflation)
    }

	/* View Functions */

	const { runContractFunction: getLotteryId } = useWeb3Contract({
        abi: abi,
        contractAddress,
        functionName: "getLotteryId",
        params: {},
    })

	const { runContractFunction: getLotteryState } = useWeb3Contract({
        abi: abi,
        contractAddress,
        functionName: "getLotteryState",
        params: {},
    })

	const { runContractFunction: getCurrentPool } = useWeb3Contract({
        abi: abi,
        contractAddress,
        functionName: "getBalance",
        params: {},
    })

    const { runContractFunction: getMinimumEntry } = useWeb3Contract({
        abi: abi,
        contractAddress,
        functionName: "getMinimumEntry",
        params: {},
    })

    const { runContractFunction: getPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress,
        functionName: "getPlayers",
        params: {},
    })

    const { runContractFunction: getLotteryHistory } = useWeb3Contract({
        abi: abi,
        contractAddress,
        functionName: "getLotteryHistory",
        params: {},
    })

	async function updateUIValues() {
		if (chainId !== contractChainId)
			return;

		const _lotteryId = (await getLotteryId()).toString()
		const _lotteryState = (await getLotteryState()).toString()
		const _currentPool = (await getCurrentPool()).toString()
        const _entranceFee = (await getMinimumEntry()).toString()
        const _players = await getPlayers()
        const _lotteryHistory = await getLotteryHistory()
		setCurrentPool(_currentPool)
        setEntranceFee(_entranceFee)
        setNumberOfTickets(_players[0].length)
		setPlayers(_players)
        setLotteryHistory(_lotteryHistory)
		setLotteryState(_lotteryState)
		setLotteryId(_lotteryId)
    }

		const {
			runContractFunction: enterLottery,
			data: enterTxResponse,
			isLoading,
			isFetching,
		} = useWeb3Contract({
			abi: abi,
			contractAddress,
			functionName: "enter",
			msgValue: entranceFee,
			params: {},
		})

	async function handleEnterLottery() {
		console.log('entering...')
		await enterLottery({
			// onComplete:
			// onError:
			onSuccess: handleSuccess,
			onError: handleError,
		})
	}

	const dispatch = useNotification()
	const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

	const handleError = (err) => {
		console.log(err)
		dispatch({
            type: "error",
            message: err.data.message,
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
	}

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUIValues()
        handleNewNotification(tx)
    }

	const isMobile = () => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	const data = {
		chainId,
		status,
		players,
        inflationToday,
		currentPool,
		entranceFee,
		numberOfTickets,
		lotteryHistory,
		lotteryState,
		lotteryId,
		isLoading,
		isFetching
	}
	const fn = {
		isMobile,
		handleEnterLottery
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default DataContextProvider;