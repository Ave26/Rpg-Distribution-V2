import React, { useEffect } from "react";

interface Toggle {
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<Toggle> = ({ toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-1 bg-black text-white rounded-md dark:text-black dark:bg-white text-center mt-4"
    >
      Theme
    </button>
  );
};

export default ThemeToggle;
