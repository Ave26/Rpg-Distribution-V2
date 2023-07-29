import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import Image from "next/image";

import ProductManagement from "@/public/assets/dashBoardIcons/AddProduct.png";

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
          className="h-full w-full animate-emerge px-3 text-start hover:text-sky-500">
          {childName?.name}
        </Link>
      );
    }

    return (
      <div className="flex flex-row items-center justify-center gap-4 md:flex-col">
        {children}
      </div>
    );
  };

  return (
    <div className="sr-only select-none font-bold md:not-sr-only">
      <div
        ref={dropDownTracker}
        className={`sr-only flex flex-row items-center justify-between md:not-sr-only`}
        onClick={(e) => {
          e.preventDefault();
          setIsDropDown((prevState) => !prevState);
        }}>
        <Image
          src={ProductManagement}
          alt={"Product Management Icon"}
          width={20}
          height={20}
          className="object-contain"
        />
        <h1 className="fond-bold m-2 w-fit text-[82%]">{initialName}</h1>
        <RiArrowDropDownLine
          size={20}
          className={`h-fit w-fit border border-black transition-all ${
            isDropDown ? "rotate-0" : "rotate-90"
          } `}
        />
      </div>
      {isDropDown && renderChildren()}
    </div>
  );
}
