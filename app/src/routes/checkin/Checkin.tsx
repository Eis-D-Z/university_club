import { checkIn, getNFT } from '@/hooks/useCheckin';
import { useCurrentAccount, useSignAndExecuteTransactionBlock} from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Checkin = () => {
	const [userData, setUserData] = useState<any>(null);
    const account = useCurrentAccount();
	const { mutate: singAndExecute } = useSignAndExecuteTransactionBlock();
	const navigate = useNavigate();

	const formatNumber = (num: number) => {
		if(num === 1) return "1st";
		if(num === 2) return "2nd";
		if(num === 3) return "3rd";
		return `${num}th`;
	}

	const handleCheckin = async () => {
		const tx = await checkIn(userData.id);
		singAndExecute({transactionBlock: tx, options:{showEffects: true}}, {
			onSuccess: (response) => {
				console.log(response);
				navigate("/thankyou");
			},
			onError: (err) => {
				console.log(err);
			}

		})
	}

    useEffect(() => {
		const getData = async () => {
			const nft = await getNFT(account?.address!);
			setUserData(nft);
		}
        if(account?.address)
			getData();
    }, [account?.address])  

	if (account?.address && userData && userData.position) return (
		<div className='flex flex-col'>
			<span>Welcome {userData.position}-nim.</span>
			<span>This will be the {formatNumber(Number(userData.meetings_attended.fields.size) + 1)} meeting you will be attending.</span>
			<span>Please press the button to check-in.</span>
			<button 
				onClick={handleCheckin}
				className='border-2 border-gray-400 bg-sky-400 w-40'
			>
				Check-in
			</button>
		</div>
	);
	else
		return (
			<div>
				<p>Members only!</p>
				<p>Please connect your wallet.</p>
			</div>
		);
};
