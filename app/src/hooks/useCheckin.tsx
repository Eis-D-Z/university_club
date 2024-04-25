import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

import { ClubMemberType, network, clubId, packageId, ClubNameType } from '@/constants';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui.js/utils';

const client = new SuiClient({
	url: getFullnodeUrl(network),
});

export const getNFT = async (address: string) => {
	const objects = await client.getOwnedObjects({
		owner: address,
		filter: {
			StructType: `${ClubMemberType}`,
		},
		limit: 40,
		options: { showContent: true, showType: true },
	});

	if (objects.data.length === 0) {
		console.warn('Not a member');
		return { message: 'Not a member' };
	}
	if (objects.data.length > 1) {
		console.warn('Member has more than 1 NFTs!!!');
		return { message: 'Multiple membership accounts. Please talk to your president.' };
	}
    const nftData = objects.data[0].data?.content?.fields;
	nftData.id = nftData.id.id;
    return nftData;
};

export const getClubData = async () => {
    const club: any = await client.getObject({id: clubId, options: {showContent: true} });
    return club.data.content.fields;
}

export const checkIn = async (nft: string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::club::prove_attendance`,
        typeArguments: [ClubNameType],
        arguments: [tx.object(clubId), tx.object(nft), tx.object(SUI_CLOCK_OBJECT_ID)]
    });
    return tx;
}
