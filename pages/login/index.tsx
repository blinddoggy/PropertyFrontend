import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import AuthInput from '@/components/AuthInput';
import Button from '@/components/Button';

const Login = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	//conectar metamask
	const getEthereumObject = () => window.ethereum;

	/*
	 * This function returns the first linked account found.
	 * If there is no account linked, it will return null.
	 */

	const login = useCallback(async () => {
		if (!username || !password) return;
		setIsLoading(true);

		const findMetaMaskAccount = async () => {
			try {
				const ethereum = getEthereumObject();

				/*
				 * First make sure we have access to the Ethereum object.
				 */
				if (!ethereum) {
					console.error('Make sure you have Metamask!');
					return { account: null, error: 'Make sure you have Metamask!' };
				}

				console.log('We have the Ethereum object', ethereum);
				// window.ethereum.request({method:'eth_requestAccounts'}).then(console.log)
				const accounts = await ethereum.request({
					method: 'eth_requestAccounts',
				});

				if (accounts.length !== 0) {
					const account: String = accounts[0];
					console.log('Found an authorized account:', account);
					return { account, error: null };
				} else {
					console.error('No authorized account found');
					return { account: null, error: 'No authorized account found' };
				}
			} catch (error) {
				console.error(error);
				return {
					account: null,
					error:
						'Something went wrong during the authentication process. Please try signing in again.',
				};
			}
		};

		try {
			findMetaMaskAccount().then(async ({ account, error }) => {
				if (account != null) {
					const method = 'post';
					const body = JSON.stringify({ username, password });

					const response = await fetch('api/auth/login', { method, body });

					if (response.status == 200) {
						router.replace('/projects');
					} else {
						setError('Enter valid and correct username / password');
					}
				}
				if (error != null) setError(error);
			});
		} catch (catchError) {
			console.error(catchError);
			if (error != null) setError(error);
		} finally {
			setIsLoading(false);
		}
	}, [username, password, router, error]);

	return (
		<div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
			<div className="bg-black w-full h-full transition  lg:bg-opacity-50">
				<div className="container h-full mx-auto xl:px-30 max-w-7xl px-3 sm:px-12 py-4">
					<div className="bg-[#101010] rounded-3xl overflow-hidden pt-8 sm:pt-16 pb-6 ">
						<nav className=" px-4 sm:px-12 ">
							<Image
								className="object-contain mx-auto md:ml-auto md:mr-0"
								src="/images/logo_h_dorado.png"
								alt="Property Token Logo"
								width={400}
								height={50}
							/>
						</nav>

						<div className="flex justify-center md:-mt-12 lg:-mt-16">
							<div className="px-4 sm:px-16 py-5 self-center mt-2 lg:mr-auto lg:w-3/5 w-full ">
								<h2 className="text-white  text-6xl mb-10 font-semibold">
									Login
								</h2>
								<div className="flex flex-col gap-4">
									<AuthInput
										id="username"
										label="Username"
										value={username}
										onChange={(e: any) => setUsername(e.target.value)}
									/>
									<AuthInput
										id="password"
										type="password"
										label="Password"
										value={password}
										onChange={(e: any) => setPassword(e.target.value)}
									/>
									{error && (
										<p className="text-center text-red-700 font-semibold">
											{error}
										</p>
									)}
									<Button
										label={isLoading ? 'Loading...' : 'Login'}
										disabled={isLoading}
										fullWidth
										outlineHover
										onClick={login}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
