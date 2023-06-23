import React from "react";

export default function Footer({ footerSky = "bg-transparent" }) {
  return (
    <div
      className={`h-24 bg-white text-black flex justify-start p-4 items-center relative gap-2`}>
      <section className="">
        <p>&copy; 2023 Alright Reserve</p>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </section>
    </div>
  );
}
