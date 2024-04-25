import { useClub } from '@/hooks/useClub';
import { ConnectButton } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
// const DAY = HOUR * 24;

type TimerProps = {
	deadline: number;
};

const Timer = ({ deadline }: TimerProps) => {
	const [time, setTime] = useState(Math.abs(deadline - Date.now()));

	useEffect(() => {
		const interval = setInterval(() => setTime(deadline - Date.now()), 1000);
		return () => clearInterval(interval);
	});

	return (
		<div className="flex flex-row">
			{Object.entries({
				// Days: (time / DAY)
				Hours: (time / HOUR) % 24,
				Minutes: (time / MINUTE) % 60,
				Seconds: (time / SECOND) % 60,
			}).map(([label, value]) => {
				return (
					<div key={label} className="px-5">
						<p>{`${Math.floor(value)}`.padStart(2, '0')}</p>
						<span>{label}</span>
					</div>
				);
			})}
		</div>
	);
};

export const Header = () => {
	

	const {clubData} = useClub();
	if (clubData && Number(clubData.next_meeting_time) > 0) {
		return (
			<div className="flex flex-row justify-between">
				<div className="flex flex-col items-center justify-center ml-auto">
					<p>University Club -- weekly meeting {Date.now() - Number(clubData.next_meeting_time) > 0 ? 'started' : 'staring in'} </p>
					<Timer deadline={Number(clubData.next_meeting_time)} />
					{Date.now() - Number(clubData.next_meeting_time) > 0 && <p>ago</p>}
				</div>
				<div className="ml-auto mr-[5px] sm:mr-[10px] lg:mr-[15px] self-center">
					<ConnectButton />
				</div>
			</div>
		);
	} else {
		return (
			<div className='flex flex-row justify-between'>
				<span className='ml-auto'>Please set the new meeting President-nim.</span>

				<div className="ml-auto mr-[5px] sm:mr-[10px] lg:mr-[15px] self-center">
					<ConnectButton />
				</div>
				
			</div>
		);
	}
};
