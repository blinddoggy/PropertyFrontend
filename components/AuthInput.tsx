
interface InputProps {
  id: string;
  onChange: any;
  value: string;
  label: string;
  type?: string;
}

const AuthInput: React.FC<InputProps> = ({ id, onChange, value, label, type }) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        className="
        block
        px-2
        pt-6
        pb-1
        border-b-2 
        border-white
        w-full
        text-md
        text-white
        bg-transparent
        appearance-none
        focus:outline-none
        focus:ring-0
        peer
        invalid:border-b-1
        "
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="
          absolute 
          text-md
          text-zinc-300
          duration-150 
          transform 
          -translate-y-3 
          scale-75 
          top-4 
          z-10 
          origin-[0] 
          left-1
          cursor-pointer
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-3
        "
      >
        {label}
      </label>
    </div>
  );
}

export default AuthInput;