import { ethers } from 'ethers';
import PropertyToken from '@/utils/PropertyMaster/PropertyMaster.json';

import { ProjectFromPropertyMaster as ProjectFromPropertyMaster } from '@/interfaces/interfaces';

let contract: ethers.Contract;
let ethereum;

/**
 * This function returns the Ethereum instance from the window object if it exists, otherwise it throws
 * an error.
 * @returns The function `getEthereumInstance` returns a Promise that resolves to the `ethereum` object
 * from the window object. If the `ethereum` object doesn't exist, it throws an error message.
 */
export const getEthereumInstance = async () => {
	if (!ethereum) {
		ethereum = window.ethereum;
		if (!ethereum) {
			throw "Ethereum object doesn't exist!";
		}
	}

	return ethereum;
};

/**
 * The function connects to a user's Ethereum wallet and returns their account address.
 * @returns The function `connectWallet` returns the first account from the array of accounts obtained
 * after requesting access to the user's Ethereum wallet through the `eth_requestAccounts` method.
 */
export const connectWallet = async () => {
	try {
		const ethereum = await getEthereumInstance();
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		return accounts[0];
	} catch (error) {
		console.error(error);
	}
};

/**
 * This function creates an instance of an Ethereum contract using its address and returns it.
 * @param {string} contractAddress - The Ethereum address of the smart contract that you want to
 * interact with.
 * @returns The `createContract` function returns an instance of the `ethers.Contract` class, which is
 * created using the provided `contractAddress` and the `PropertyToken.abi` interface. The returned
 * contract instance is connected to the Ethereum network using the `ethereum` instance obtained from
 * the `getEthereumInstance` function, and is also connected to a signer obtained from the `provider`
 * object
 */
export const createContract = async (contractAddress: string) => {
	const ethereum = await getEthereumInstance();

	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();

	if (!contract) {
		contract = new ethers.Contract(contractAddress, PropertyToken.abi, signer);
	}
	return { contract, provider };
};

/**
 * This TypeScript function retrieves the owner of a smart contract given its address.
 * @param {string} contractAddress - A string representing the address of a smart contract on the
 * blockchain.
 * @returns The function `getOwner` returns a Promise that resolves to a string representing the owner
 * of a smart contract deployed at the specified `contractAddress`. If an error occurs during the
 * execution of the function, it will be caught and logged to the console.
 */
export const getOwner = async (contractAddress: string) => {
	try {
		const { contract } = await createContract(contractAddress);
		if (contract) {
			const owner = await contract.owner();
			return owner as string;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * This TypeScript function validates if the current wallet account is the owner of a given contract
 * address.
 * @param {string} contractAddress - a string representing the address of a smart contract on the
 * blockchain.
 * @returns a boolean value indicating whether the current connected wallet account is the owner of the
 * smart contract with the given contract address.
 */
export const validateOwner = async (contractAddress: string) => {
	try {
		const account = await connectWallet();
		const owner = await getOwner(contractAddress);
		return owner?.toLowerCase() === account.toLowerCase();
	} catch (error) {
		console.error(error);
		return false;
	}
};

/**
 * This TypeScript function retrieves a project from a smart contract using its IPFS hash.
 * @param {string} contractAddress - A string representing the address of a smart contract on the
 * blockchain.
 * @param {string} ipfsHash - The ipfsHash parameter is a string that represents the unique identifier
 * of a file stored on the InterPlanetary File System (IPFS). In this code snippet, it is used as an
 * argument to retrieve a specific project from a smart contract deployed on the blockchain.
 * @returns a Promise that resolves to a ProjectFromPropertyMaster object, which represents a project
 * retrieved from a smart contract at a given contract address and IPFS hash. If there is an error, the
 * function logs it to the console.
 */
export const getPropertyProject = async (
	contractAddress: string,
	ipfsHash: string
) => {
	try {
		const { contract } = await createContract(contractAddress);
		if (contract) {
			const property: ProjectFromPropertyMaster = await contract.getProject(
				ipfsHash
			);
			return property;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * This function creates a new property on a smart contract with specified parameters.
 * @param {string} contractAddress - The address of the smart contract where the new property will be
 * created.
 * @param {string} name - The name of the property being created.
 * @param {string} symbol - The symbol parameter is a string that represents the symbol or abbreviation
 * of the property being created. For example, if the property is a cryptocurrency, the symbol could be
 * BTC for Bitcoin or ETH for Ethereum.
 * @param {string} ipfsHash - A string representing the IPFS hash of the property's metadata. IPFS
 * (InterPlanetary File System) is a protocol and network designed to create a content-addressable,
 * peer-to-peer method of storing and sharing hypermedia in a distributed file system.
 * @param {string} amount - The amount parameter is a string representing the value or price of the
 * property being created.
 * @param {string} imageUri - A string representing the URI (Uniform Resource Identifier) of the image
 * associated with the new property being created.
 * @returns The function `createNewProperty` returns the address of a newly created property.
 */
export const createNewProperty = async (
	contractAddress: string,
	name: string,
	symbol: string,
	ipfsHash: string,
	amount: string,
	imageUri: string
) => {
	try {
		const { contract } = await createContract(contractAddress);

		if (contract) {
			const propertyAddress = await contract.createNewProperty(
				name,
				symbol,
				ipfsHash,
				amount,
				imageUri
			);
			return propertyAddress;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * This function exports a method called `distributeBalaceErc20` that takes a `contractAddress`
 * parameter as a string. It creates a contract instance using the `createContract` function and then
 * calls the `distributeBalaceErc20` method on the contract instance. This method likely distributes
 * the balance of the ERC20 token associated with the contract to the token holders.
 * @returns the status of the `distributeBalaceErc20` method call.
 */
export const distributeBalance = async (
	contractAddress: string,
	ipfsHash: string
) => {
	try {
		const { contract } = await createContract(contractAddress);
		if (contract) {
			const status = await contract.distributeBalance(ipfsHash);
			await status.wait();
			return status;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * This function transfers an ERC721 token from one address to another.
 * @param {string} contractAddress - The address of the ERC721 contract that you want to interact with.
 * @param {string} ipfsHash - The IPFS hash is a unique identifier for a file stored on the
 * InterPlanetary File System (IPFS). In this context, it is likely referring to the hash of a specific
 * ERC721 token that is being transferred from one address to another.
 * @param {string} from - The address of the sender who is transferring the ERC721 token.
 * @param {string} to - The "to" parameter in the transferNFT function is a string representing the
 * Ethereum address of the recipient of the ERC721 token being transferred.
 * @returns the status of the transferNFT method call on the contract.
 */
export const transferNFT = async (
	contractAddress: string,
	ipfsHash: string,
	from: string,
	to: string
) => {
	try {
		const { contract } = await createContract(contractAddress);
		if (contract) {
			const status = await contract.transferErc721(ipfsHash, from, to);
			return status;
		}
	} catch (error) {
		console.error(error);
	}
};

export enum ContractEventNames {
	NewPropertyCreated = 'NewPropertyCreated',
	DistributedBalance = 'DistributedBalance',
	TransferredNFT = 'TransferredErc721',
	OwnershipTransferred = 'OwnershipTransferred',
	Transferred = 'Transferred',
}

/**
 * This function subscribes to a specific event emitted by a smart contract and executes a provided
 * event handler function.
 * @param {string} contractAddress - The Ethereum address of the smart contract that you want to
 * subscribe to events from.
 * @param {ContractEventNames} contractEventName - ContractEventNames is likely an enum or a type that
 * defines the possible event names that can be subscribed to for a smart contract. It could include
 * events such as "Transfer", "Approval", or any custom events defined in the contract.
 * @param eventHandler - The eventHandler parameter is a function that takes an event object as its
 * argument and performs some action with it. This function is called whenever the specified contract
 * event is emitted.
 */
export const subscribeToContractEvent = async (
	contractAddress: string,
	contractEventName: ContractEventNames,
	eventHandler: (event: any) => void
) => {
	try {
		const { contract } = await createContract(contractAddress);
		if (contract) {
			contract.on(contractEventName, eventHandler);
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * This function unsubscribes an event handler from a specified contract event.
 * @param {string} contractAddress - A string representing the address of the smart contract on the
 * blockchain.
 * @param {ContractEventNames} contractEventName - ContractEventNames is likely an enum or a type that
 * defines the possible event names that can be emitted by the smart contract. It is used to specify
 * which event to unsubscribe from.
 * @param eventHandler - The eventHandler parameter is a function that takes an event object as its
 * argument and performs some action with the data contained in the event object. This function is
 * typically used to handle events emitted by a smart contract on the blockchain.
 */
export const unsubscribeToContractEvent = async (
	contractAddress: string,
	contractEventName: ContractEventNames,
	eventHandler: (event: any) => void
) => {
	try {
		const { contract } = await createContract(contractAddress);
		if (contract) {
			contract.off(contractEventName, eventHandler);
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * This function retrieves the event history of a contract by creating a contract instance, applying a
 * filter, and querying the blockchain for events.
 * @param {string} contractAddress - The address of the smart contract on the blockchain.
 * @param {ContractEventNames} contractEventName - The name of the event emitted by the contract that
 * you want to retrieve the history for.
 * @param {string} [filter] - An optional parameter that can be used to filter the events returned by
 * the function. It is a string that represents the filter criteria for the events. If not provided,
 * the function will return all events for the specified contract event name.
 * @returns a Promise that resolves to an array of events that match the specified contract address,
 * contract event name, and optional filter.
 */
export const getEventHistory = async (
	contractAddress: string,
	contractEventName: ContractEventNames,
	filter?: string
) => {
	try {
		const { contract, provider } = await createContract(contractAddress);
		if (contract) {
			const eventFilter = filter
				? contract.filters[contractEventName](filter)
				: contract.filters[contractEventName]();
			const latestBlockNumber = await provider.getBlockNumber();
			const startBlockNumber = latestBlockNumber - 1;
			const events = await contract.queryFilter(
				eventFilter,
				startBlockNumber,
				latestBlockNumber
			);
			return events;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * The function takes a hexadecimal string and converts it to a decimal number with a specified number
 * of decimal places.
 * @param {string} hex - The hexadecimal string that needs to be converted to decimal.
 * @param {number} [decimals=4] - The "decimals" parameter is an optional parameter that specifies the
 * number of decimal places to include in the returned decimal number. If this parameter is not
 * provided, the default value of 4 is used.
 * @returns The function `parseHexToDecimal` returns a decimal representation of the hexadecimal input
 * string `hex`. If the `decimals` parameter is provided, the function returns the decimal number with
 * the specified number of decimal places. If `decimals` is not provided, the function returns the
 * decimal number with 4 decimal places by default.
 */
export const parseHexToDecimal = (hex: string, decimals: number = 4) => {
	const num = parseInt(hex, 16);
	if (decimals === 0) return num;
	return num.toFixed(decimals);
};

/**
 * The function converts a hexadecimal value representing an amount of wei to a string representing the
 * equivalent amount of ether, with a specified number of decimal places.
 * @param {string} hex - a string representing a hexadecimal value of a wei amount (e.g. "0x123abc")
 * @param {number} [decimals=4] - The `decimals` parameter is an optional parameter that specifies the
 * number of decimal places to round the converted Ether amount to. If this parameter is not provided,
 * the default value of 4 is used.
 * @returns The function `parseWeiHexToEthers` returns a string representation of the ether amount
 * parsed from the input hexadecimal string, with the specified number of decimal places.
 */
export const parseWeiHexToEthers = (
	hex: string,
	decimals: number = 4
): string => {
	const weiAmount = ethers.BigNumber.from(parseInt(hex, 16).toString());
	const etherAmount = parseFloat(ethers.utils.formatEther(weiAmount));

	return etherAmount.toFixed(decimals);
};

/**
 * The function abbreviates a given NFT address by displaying the first 10 characters and the last 5
 * characters, separated by ellipses.
 * @param {string} address - a string representing an NFT address.
 * @returns The function `abbreviateNftAddress` returns a string that contains the first 10 characters
 * of the input `address`, followed by an ellipsis (`...`), and then the last 5 characters of the input
 * `address`. If the input `address` is falsy (e.g. `null`, `undefined`, `''`, `0`, `false`, etc.), an
 * empty string
 */
export const abbreviateNftAddress = (address: string) => {
	if (!address) return '';
	return `${address.substring(0, 10)}...${address.substring(
		address.length - 5
	)}`;
};

/**
 * This function validates if the current chain ID of an Ethereum instance matches the Binance Smart
 * Chain network.
 * @returns a boolean value indicating whether the current chain ID of the connected Ethereum instance
 * matches the Binance Smart Chain network ID (0x38).
 */
export const validateChainId = async () => {
	const bnbNetHex = 0x38;
	const ethereum = await getEthereumInstance();
	const chainId = await ethereum.request({ method: 'eth_chainId' });
	return chainId == bnbNetHex;
};

/**
 * This function subscribes or unsubscribes to the 'chainChanged' event and calls a callback function
 * when the event is triggered.
 * @param {boolean} subscribe - A boolean value indicating whether to subscribe or unsubscribe to the
 * 'chainChanged' event.
 * @param handleChainChanged - a function that takes an event object as its parameter and performs some
 * action when the chainChanged event is triggered.
 */
export const subscribeToChainChanged = async (
	subscribe: boolean,
	handleChainChanged: (event: any) => void
) => {
	const ethereum = await getEthereumInstance();
	if (subscribe) {
		ethereum.on('chainChanged', handleChainChanged);
	} else {
		ethereum.removeListener('chainChanged', handleChainChanged);
	}
};
