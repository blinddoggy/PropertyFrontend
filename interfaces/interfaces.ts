export interface ProjectFromPropertyMaster {
	balanceERC20: { _isBigNumber: boolean; _hex: string; decimal: number };
	balanceERC721: { _isBigNumber: boolean; _hex: string; decimal: number };
	img: string;
	name: string;
	nftAddress: string;
	symbol: string;
}

export interface ProjectFormPinata {
	id: string;
	name: string;
	image: string;
	metadata: { [key: string]: any };
}
