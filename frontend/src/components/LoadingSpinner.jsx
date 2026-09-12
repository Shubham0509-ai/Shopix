const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center py-12'>
			<div className='relative flex items-center justify-center'>
				<div className='w-14 h-14 border-2 border-white/10 rounded-full' />
				<div className='w-14 h-14 border-2 border-transparent border-t-violet-500 border-r-cyan-400 animate-spin rounded-full absolute' />
				<div className='w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_12px_#a855f7]' />
				<div className='sr-only'>Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;