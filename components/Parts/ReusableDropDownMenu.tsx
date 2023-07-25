import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

interface ChildNamePrefixLinkProps {
  endPoint?: string;
  name: string;
}

interface ReusableDropDownProps {
  initialName: string;
  numberOfChildren: number;
  childNamePrefix: ChildNamePrefixLinkProps[];
}

export default function ReusableDropDownMenu({
  initialName,
  numberOfChildren,
  childNamePrefix,
}: ReusableDropDownProps) {
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<boolean>(false);
  const dropDownTracker = useRef<HTMLDivElement>(null);
  const renderChildren = () => {
    const children = [];

    for (let i = 1; i <= numberOfChildren; i++) {
      const childName = childNamePrefix[i - 1];
      children.push(
        <Link
          href={`/dashboard/${childName?.endPoint}`}
          key={i}
          className="w-fit select-none whitespace-nowrap rounded-lg bg-[#65CECA] p-2 text-start font-bold transition-all duration-75 ease-linear focus:bg-[#3B7B5] hover:rounded-e-2xl hover:bg-[#65CECA] md:w-[10rem] md:rounded-s-none md:bg-transparent md:transition-all">
          {childName?.name}
        </Link>
      );
    }

    return (
      <div className="flex flex-row items-center justify-center gap-2 md:flex-col">
        {children}
      </div>
    );
  };

  return (
    <div className="sr-only select-none font-bold md:not-sr-only">
      <div
        ref={dropDownTracker}
        className={`sr-only flex items-center justify-center md:not-sr-only`}
        onClick={(e) => {
          e.preventDefault();
          setIsDropDown((prevState) => !prevState);
        }}>
        <h1 className="">{initialName}</h1>
        <RiArrowDropDownLine
          size={20}
          className={`transition-all ${isDropDown ? "rotate-0" : "rotate-90"}`}
        />
      </div>
      {isDropDown && renderChildren()}
    </div>
  );
}
