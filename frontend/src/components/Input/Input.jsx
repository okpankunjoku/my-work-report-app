import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType =
    isPassword && showPassword
      ? "text"
      : type;

  return (
    <div className="w-full">

      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">

        {/* Left Icon */}
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}

        {/* Input */}
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={
            isPassword
              ? "current-password"
              : "off"
          }
          className={`
            w-full
            border
            border-gray-300
            rounded-lg
            py-3
            ${icon ? "pl-11" : "pl-4"}
            ${isPassword ? "pr-12" : "pr-4"}
            text-gray-800
            placeholder-gray-400
            bg-white
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          `}
        />

        {/* Show / Hide Password */}
        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-400
              hover:text-blue-600
              transition
              focus:outline-none
            "
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <FaEyeSlash size={18} />
            ) : (
              <FaEye size={18} />
            )}
          </button>
        )}

      </div>

    </div>
  );
}

export default Input;