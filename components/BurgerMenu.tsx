import React, { SetStateAction } from "react";

interface Menu {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<SetStateAction<boolean>>;
}

const BurgerMenu: React.FC<Menu> = ({ menuOpen, setMenuOpen }) => {
  const handleMenu = () => {
    console.log("menu is click");
    setMenuOpen((menu) => !menu);
  };

  return (
    <div className="tablet:hidden block space-y-1" onClick={handleMenu}>
      <div className={`h-1.5 w-9 rounded-md bg-gray-600 transition-all`}></div>
      <div
        className={`${
          menuOpen && "w-6 transition-all"
        } h-1.5 w-9 rounded-md bg-gray-600 transition-all`}></div>
      <div className={`h-1.5 w-9 rounded-md bg-gray-600`}></div>
    </div>
  );
};
export default BurgerMenu;
