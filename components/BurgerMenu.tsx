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
    <div className="block space-y-1 tablet:hidden" onClick={handleMenu}>
      <div className={`w-9 rounded-md h-1.5 bg-gray-600`}></div>
      <div
        className={`${
          menuOpen && "w-6"
        } transition-all w-9 rounded-md h-1.5 bg-gray-600`}
      ></div>
      <div className={`w-9 rounded-md h-1.5 bg-gray-600`}></div>
    </div>
  );
};
export default BurgerMenu;
