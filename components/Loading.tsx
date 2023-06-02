interface LoadingProps {
	loadingMessage: String;
}

const Loading: React.FC<LoadingProps> = ({ loadingMessage }) => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="bg-white w-80 h-60 p-8 rounded-lg shadow-lg">
				<div className="animate-spin rounded-full mx-auto mb-4 h-16 w-16 border-t-2 border-b-2 border-slate-300"></div>
				<h2 className="text-3xl font-bold">Cargando...</h2>
				<p
					className={`text-sm text-center transition-opacity duration-500 ${
						loadingMessage ? '' : ' opacity-0'
					}`}>
					{loadingMessage}
				</p>
			</div>
		</div>
	);
};

export default Loading;
