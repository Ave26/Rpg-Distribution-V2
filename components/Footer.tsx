import React from "react";

export default function Footer({ footerSky = "bg-transparent" }) {
  return (
    <div
      className={`text-all relative flex h-24 w-full items-center justify-start gap-2 break-all bg-white p-4`}>
      <section className="">
        <p>&copy; 2023 Alright Reserve</p>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </section>
    </div>
  );
}
