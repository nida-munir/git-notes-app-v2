import { withRouter } from 'react-router-dom';
import React from 'react';
import { auth } from './utils';
export const NavLinks = withRouter(({ history }) => {
	const signOut = () => {
		console.log('Signing out!');
		var gitHubUser = {
			isAuthenticated: false
		};
		localStorage.setItem('gitHubUser', JSON.stringify(gitHubUser));
		history.push('/');
	};
	return auth.isSignedIn() ? (
		<p>
			Welcome!
			<button onClick={signOut}>Sign out</button>
		</p>
	) : (
		<p>Welcome to GitNotes~ You are not logged in.</p>
	);
	// put this code in welcome page
});
