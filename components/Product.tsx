import React, { useState } from "react";
import Image from "next/image";
import Loading from "./Parts/Loading";

import biberon from "../public/assets/products/biberon-2-1412154.jpg";
import blender from "../public/assets/products/blender-10934_960_720.jpg";
import sousVide from "../public/assets/products/istockphoto-1285640947-612x612.jpg";
import toaster from "../public/assets/products/istockphoto-1285640996-612x612.jpg";
import riceCooker from "../public/assets/products/istockphoto-1347640680-612x612.jpg";
import crockPot from "../public/assets/products/istockphoto-1455559865-612x612.jpg";
import lipstick from "../public/assets/products/lipstick-g69ecf6007_1920.jpg";
import eyeShadow from "../public/assets/products/make-up-g57fdab8c4_1920.jpg";
import spiralNotebook from "../public/assets/products/notebook.jpg";
import ballPoint from "../public/assets/products/ballpoint.jpg";

import { HiArchive } from "react-icons/hi";

interface ProductProps {
  productName: string;
}

export default function Product({ product }: any) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const getProductImage = (productName: string): any => {
    switch (productName) {
      case "Product A":
        return {
          src: biberon,
          width: "100%",
          height: "100%",
        };
      case "Product B":
        return {
          src: blender,
          width: "100%",
          height: "100%",
        };
      case "Product C":
        return {
          src: sousVide,
          width: "100%",
          height: "100%",
        };
      case "Product D":
        return {
          src: toaster,
          width: "100%",
          height: "100%",
        };
      case "Product E":
        return {
          src: riceCooker,
          width: "100%",
          height: "100%",
        };
      case "Product F":
        return {
          src: crockPot,
          width: "100%",
          height: "100%",
        };
      case "Product G":
        return {
          src: lipstick,
          width: "100%",
          height: "100%",
        };
      case "Product H":
        return {
          src: eyeShadow,
          width: "100%",
          height: "100%",
        };
      case "Spiral Notebook":
        return {
          src: spiralNotebook,
          width: "100%",
          height: "100%",
        };
      case "Ballpoint Pen":
        return {
          src: ballPoint,
          width: "100%",
          height: "100%",
        };
      default:
        return undefined;
    }
  };
  return (
    <>
      <div className="h-full w-fit rounded-lg overflow-hidden shadow-lg relative">
        <div
          className="w-56 h-56 flex justify-center items-center transition-all overflow-hidden relative w-full"
          onMouseEnter={() => {
            setIsHovered((hovered) => !hovered);
          }}
          onMouseLeave={() => {
            setIsHovered((hovered) => !hovered);
          }}
        >
          <Image
            priority
            {...getProductImage(product.productName)}
            alt={product.productName}
            className={`${
              isHovered && "scale-110 transition-all"
            }  transition-all w-56 h-56`}
          />

          {/* {!product.image ? (
            <HiArchive />
          ) : (
            <Image
              priority
              {...getProductImage(product.productName)}
              alt={product.productName}
              className={`${
                isHovered && "scale-110 transition-all"
              }  transition-all w-56 h-56`}
            />
          )} */}
          <div
            className={`${
              isHovered
                ? "opacity-100 transition-all"
                : "transition-all opacity"
            } absolute inset-0 bg-gray-900 bg-opacity-70 text-white flex justify-center items-center transition-all opacity-0 p-4`}
          >
            <h1 className="text-xs w-52 text-justify">
              <strong className="font-extrabold">Description: </strong>
              <p className="font-semibold">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
                vitae dicta eligendi id voluptates, possimus magni nemo in,
                aliquam, impedit aliquid cumque labore cum illo quasi recusandae
                quaerat excepturi voluptas?
              </p>
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-start flex-col p-2">
          <strong>
            <h1 className="text-xs">{product.productName}</h1>
          </strong>
          <h1 className="text-xs">Quantity: {product.quantity}</h1>
        </div>
      </div>
    </>
  );
}
