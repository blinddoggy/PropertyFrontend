interface InputProps {
	placeholder?: string;
	value?: string;
	type?: string;
	disabled?: boolean;
	whiteMode?: boolean;
	accept?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
	placeholder,
	value,
	type,
	disabled,
	onChange,
	accept,
	whiteMode = false,
}) => {
	return (
		<input
			placeholder={placeholder}
			value={value}
			type={type}
			accept={accept}
			disabled={disabled}
			onChange={onChange}
			className={`
        w-full
        py-1
        px-2
        text-lg
        ${whiteMode ? 'bg-white' : 'bg-black'}
        border-2
        border-neutral-800
        rounded-md
        outline-none
        ${whiteMode ? 'text-black' : 'text-white'}
        focus:border-slate-300
        focus:border-2
        transition
        disabled:bg-neutral-900
        disabled:opacity-70
        disabled:cursor-not-allowed
      `}
		/>
	);
};

export default Input;
