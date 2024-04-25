import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { isValidSuiAddress } from '@mysten/sui.js/utils';
import { useEffect, useState } from 'react';

import { getNFT } from '@/hooks/useCheckin';
import { newMember } from '@/hooks/useClub';

export const NewMember = () => {
	const [userData, setUserData] = useState<any>({});
	const [newMemberAddress, setNewMemberAddress] = useState('');
	const [newMemberPosition, setNewMemberPosition] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
	const account = useCurrentAccount();
	const { mutate: SignAndExecute } = useSignAndExecuteTransactionBlock();

	const handleNewMember = async () => {
		if (!isValidSuiAddress(newMemberAddress)) {
			console.log('Invalid Sui address');
			return;
		}
		const tx = newMember(newMemberAddress, newMemberPosition);

		SignAndExecute({ transactionBlock: tx, options: { showEffects: true } }, {
            onSuccess: () => {
                console.log("New member created");
                setIsSuccess(true);
            },
            onError: (err) => {
                console.log(err)
            }
        });
	};

	useEffect(() => {
		const getData = async () => {
			const nft = await getNFT(account?.address!);
			setUserData(nft);
		};
		if (account?.address) getData();
	}, [account?.address]);

	if (!account || !account.address) return <div> Please connect your wallet.</div>;
	else if (!(userData.position === 'President')) return <div>President only!</div>;
	else
		return (
			<div>
				<span> Add new member</span>
				<div className="flex flex-col">
					<div>
						<label>Address:</label>
						<input
							type="text"
							value={newMemberAddress}
							onChange={(evt) => {
								setNewMemberAddress(evt.target.value);
							}}
						/>
					</div>
					<div>
						<label>Position:</label>
						<input
							type="text"
							value={newMemberPosition}
							onChange={(evt) => {
								setNewMemberPosition(evt.target.value);
							}}
						/>
					</div>

					<button className="w-40 border-2 border-gray-400 bg-sky-400" onClick={handleNewMember}>
						Create
					</button>
				</div>
                {isSuccess && <span> New member created!</span>}
			</div>
		);
};
