// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Home } from '@/routes/home/Home';

import { Checkin } from './checkin/Checkin';
import { Root } from './root';
import { NewClub } from './new_club/NewClub';
import { ThankYou } from './thankyou/thankyou';
import { NewMember } from './new_member/NewMember';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <Navigate to="home" replace />,
			},
			{
				path: 'home',
				element: <Home />,
			},
			{
				path: 'checkin',
				element: <Checkin />,
			},
			{
				path: 'new',
				element: <NewClub />
			},
			{
				path: "new_member",
				element: <NewMember />
			},
			{
				path: 'thankyou',
				element: <ThankYou />
			}
		],
	},
]);
