import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui.js/utils';
import { useQuery } from '@tanstack/react-query';

import { clubId, ClubNameType, network, packageId } from '@/constants';

import { getClubData } from './useCheckin';
import { image_url } from '@/demoConstants';

export const client = new SuiClient({ url: getFullnodeUrl(network) });

export const useClub = () => {
	const { data } = useQuery({
		queryKey: ['club-data'],
		queryFn: () => getClubData(),
	});

	return { clubData: data };
};

export const newMeeting = (name: string, time: number) => {
	const tx = new TransactionBlock();

	tx.moveCall({
		target: `${packageId}::club::add_new_meeting`,
		typeArguments: [ClubNameType],
		arguments: [tx.object(clubId), tx.pure.string(name), tx.pure.u64(String(time))],
	});
	return tx;
};

export const newMember = (memberAddress: string, position: string) => {
	const tx = new TransactionBlock();

	tx.moveCall({
		target: `${packageId}::club::new_member`,
		typeArguments: [ClubNameType],
		arguments: [
			tx.object(clubId),
			tx.object(SUI_CLOCK_OBJECT_ID),
			tx.pure.address(memberAddress),
			tx.pure.string(position),
            tx.pure.string(image_url)
		],
	});

    return tx;
};
