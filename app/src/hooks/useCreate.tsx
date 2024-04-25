import { getFullnodeUrl, SuiClient, SuiTransactionBlockResponse } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { ClubNameType, network, packageId } from '@/constants';
import { image_url } from '@/demoConstants';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui.js/utils';

export const client = new SuiClient({ url: getFullnodeUrl(network) });

export const newClub = (name: string) => {
	const tx = new TransactionBlock();

	tx.moveCall({
		target: `${packageId}::club::new_club`,
		typeArguments: [ClubNameType],
		arguments: [tx.pure(name), tx.object(SUI_CLOCK_OBJECT_ID), tx.pure(image_url)],
	});

	return tx;
};

export const postProcessingNewClub = (response: SuiTransactionBlockResponse) => {
	let clubId = '';
	if (response.objectChanges != null)
		clubId = response?.objectChanges.find(
			(item: any) => item.type === 'created' && item.owner && item.owner.Shared,
		)?.objectId;
	return clubId;
};

// export const addMember = async (memberAddress: string, position: string, imageUrl: string) => {
//     const tx = new TransactionBlock();

//     tx.moveCall({
//         target: `${packageId}::club::new_member`,
//         typeArguments: [ClubType]
//     })
// }
