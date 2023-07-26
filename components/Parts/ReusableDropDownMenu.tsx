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
        <Link href={`/dashboard/${childName?.endPoint}`} key={i} className="">
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
        className={`sr-only flex flex-row items-center justify-center  md:not-sr-only`}
        onClick={(e) => {
          e.preventDefault();
          setIsDropDown((prevState) => !prevState);
        }}>
        <h1 className="w-full">{initialName}</h1>
        <RiArrowDropDownLine
          size={20}
          className={`transition-all ${isDropDown ? "rotate-0" : "rotate-90"} `}
        />
      </div>
      {isDropDown && renderChildren()}
    </div>
  );
}
