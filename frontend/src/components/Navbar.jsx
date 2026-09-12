import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	return (
		<header className='fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300'>
			<div className='max-w-7xl mx-auto glass-panel rounded-2xl px-5 py-3 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'>
				<div className='flex justify-between items-center'>
					<Link to='/' className='flex items-center space-x-2.5 group'>
						<div className='w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-300'>
							<span className='text-white font-extrabold text-lg tracking-tight'>S</span>
						</div>
						<span className='text-2xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity'>
							Shop<span className='gradient-text font-black'>ix</span>
						</span>
					</Link>

					<nav className='flex items-center gap-3 sm:gap-4'>
						<Link
							to={"/"}
							className='text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-all duration-200'
						>
							Home
						</Link>

						{user && (
							<Link
								to={"/cart"}
								className='relative group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200'
							>
								<ShoppingCart className='text-slate-400 group-hover:text-violet-400 transition-colors' size={19} />
								<span className='hidden sm:inline'>Cart</span>
								{cart?.length > 0 && (
									<span
										className='absolute -top-1.5 -right-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center
									text-[11px] font-bold shadow-md shadow-violet-500/40 animate-pulse'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{isAdmin && (
							<Link
								className='px-3.5 py-1.5 rounded-xl text-sm font-semibold text-violet-200 bg-violet-950/60 border border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-900/40 shadow-sm shadow-violet-900/30 transition-all duration-200 flex items-center gap-1.5'
								to={"/secret-dashboard"}
							>
								<Lock size={15} className='text-violet-400' />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className='px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-all duration-200'
								onClick={logout}
							>
								<LogOut size={16} className='text-slate-400' />
								<span className='hidden sm:inline'>Log Out</span>
							</button>
						) : (
							<div className='flex items-center gap-2'>
								<Link
									to={"/login"}
									className='px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all duration-200'
								>
									<LogIn size={15} />
									Login
								</Link>
								<Link
									to={"/signup"}
									className='gradient-btn text-white px-4 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5'
								>
									<UserPlus size={15} />
									Sign Up
								</Link>
							</div>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};
export default Navbar;