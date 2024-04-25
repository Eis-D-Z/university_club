import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { useState } from 'react';

import { ClubNameType } from '@/constants';
import { newClub, postProcessingNewClub } from '@/hooks/useCreate';
import { Link } from 'react-router-dom';

export const NewClub = () => {
	const clubOnChain = ClubNameType.slice(ClubNameType.lastIndexOf(':') + 1);
	const checkType = clubOnChain.replace(/[_]/g, '').toLowerCase();
	const [clubName, setClubName] = useState(clubOnChain);
	const [nameError, setNameError] = useState('');
    const [clubId, setClubId] = useState('');
	const account = useCurrentAccount();
	const { mutate: singAndExecute } = useSignAndExecuteTransactionBlock();

	const handleClick = () => {
		const checkName = clubName.replace(/[ _!^%$*@&]/g, '').toLowerCase();

		if (checkName !== checkType) {
			console.log('LALALAL');
			setNameError(
				`Name on chain: ${clubOnChain}\nand selected name: ${clubName}\n are too disimilar.`,
			);
			return;
		}
		const tx = newClub(clubName);
		singAndExecute(
			{
				transactionBlock: tx,
				options: {
					showEffects: true,
					showObjectChanges: true,
				},
			},
			{
				onSuccess: (response) => {
					const id = postProcessingNewClub(response);
                    setClubId(id);
				},
                onError: (err) => {
                    console.log(err);
                }
			},
		);
	};

	if (!account?.address) {
		return (
			<div>
				<p>Please connect your wallet.</p>
			</div>
		);
	}
	return (
		<div>
			<p className="p-2 my-1">Create a new club</p>
			<div>
				<div className="p-2 mt-1">
					<label className="">Name:</label>
					<input
						type="text"
						value={clubName}
						placeholder={clubName}
						onChange={(evt) => {
							setClubName(evt.target.value);
							if (nameError) setNameError('');
						}}
						className={`${
							nameError !== '' ? 'border-red-500' : 'border-gray-400'
						} border-2 p-1 ml-2`}
					></input>
				</div>
				{nameError !== '' ? (
					<span className="text-red-400 text-sm text-wrap">{nameError}</span>
				) : (
					<span className="text-wrap text-gray-400 text-sm">
						May add special characters like "*" or "!" and spaces. Please keep the name similar to
						the one on-chain.
					</span>
				)}
				<div className="p-2 my-1">
					<button onClick={handleClick} className="border-2 p-2 bg-sky-500">
						Create
					</button>
				</div>
			</div>
            {clubId !== "" && <div className='flex flex-col'>
                    <span> Club created successfully, please save the id: {clubId}</span>
					<Link to="new_member" replace><span>Add new members here!</span></Link>
                </div>}
		</div>
	);
};
