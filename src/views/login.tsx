import { TokenManager } from "@forgerock/javascript-sdk";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const [params] = useSearchParams();

	// Get the code and state from the URL query parameters
	const code = params.get('code');
	const state = params.get('state');

	useEffect(() => {
		async function getTokens() {
			if (code && state) {
				await TokenManager.getTokens({ query: { code, state } });
				navigate('/');
			} else {
				await TokenManager.getTokens({ login: 'redirect' });
			}
		}
		getTokens();
	}, []);

	return (
		<div>
			<h1>Login</h1>
			<p>Checking session ...</p>
		</div>
	);
}