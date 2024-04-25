import { useState } from 'react';

import { newMeeting, useClub } from '@/hooks/useClub';
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import qrCode from "@/qr-code.png";

export const Home = () => {
	const [meetingName, setMeetingName] = useState('');
	const [meetingTime, setMeetingTime] = useState(0);
    const {mutate: SignAndExecute} = useSignAndExecuteTransactionBlock()
    const account = useCurrentAccount();
    const navigate = useNavigate();

	const { clubData } = useClub();
    const handleNewMeeting = async () => {
        if (meetingName === "" || meetingTime < Date.now())
            return
        const tx = newMeeting(meetingName, meetingTime);
        SignAndExecute({
            transactionBlock: tx,
            options: {showEffects: true}
        },
        {
            onSuccess: () => {
                navigate(0);
            },
            onError: (err) => {
                console.log(err);
            }
        }
    )

    }

	if (clubData  && Date.now() - Number(clubData.next_meeting_time) < 11 * 60000)
		return (
        <div className='flex flex-col'>
            <span>Please scan the QR code to check-in.</span>
            <img width={400} height={400} src={qrCode} alt="qr-code"></img>
        </div>
    );
	else if(account?.address)
		return (
			<div className="flex flex-col">
				<span> New Meeting </span>
				<div className="my-2">
					<label>Name:</label>
					<input
						type="text"
						value={meetingName}
						placeholder="Weekly Meeting"
						onChange={(evt) => {
							setMeetingName(evt.target.value);
						}}
                        className='ml-1'
					></input>
				</div>
				<div className='my-2'>
					<label>Time:</label>
					<input
						type="datetime-local"
						onChange={(evt) => {
							const timestamp = new Date(evt.target.value).getTime();
							setMeetingTime(timestamp);
						}}
                        className='ml-1'
					></input>
				</div>
				<button onClick={handleNewMeeting} className="border-2 border-gray-400 bg-sky-400 w-40">Go</button>
			</div>
		);

        else return <div><span>Please connect your wallet first.</span></div>
};
