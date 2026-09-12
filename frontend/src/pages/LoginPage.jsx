import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md text-center'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-4 text-center text-3xl font-black text-white tracking-tight'>
					Welcome <span className='gradient-text'>Back</span>
				</h2>
				<p className='mt-2 text-sm text-slate-400'>
					Access your Shopix digital closet & order status
				</p>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='glass-panel py-8 px-5 sm:px-9 shadow-2xl shadow-black/40 rounded-3xl border border-white/10'>
					<form onSubmit={handleSubmit} className='space-y-5'>
						<div>
							<label htmlFor='email' className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
								Email address
							</label>
							<div className='mt-1.5 relative rounded-xl shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-slate-400' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='block w-full px-3.5 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						<div>
							<label htmlFor='password' className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
								Password
							</label>
							<div className='mt-1.5 relative rounded-xl shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-slate-400' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='block w-full px-3.5 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all'
									placeholder='••••••••'
								/>
							</div>
						</div>

						<button
							type='submit'
							className='w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white gradient-btn shadow-lg shadow-violet-600/25 transition duration-200 cursor-pointer disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Signing in...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Sign in
								</>
							)}
						</button>
					</form>

					<p className='mt-7 text-center text-xs text-slate-400'>
						Not a member yet?{" "}
						<Link to='/signup' className='font-semibold text-violet-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1'>
							Create account <ArrowRight className='h-3.5 w-3.5' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default LoginPage;