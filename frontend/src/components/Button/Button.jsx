function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-3 rounded-lg font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;