import React from "react";

export default function Footer({ footerSky = "bg-transparent" }) {
  return (
    <div
      className={`h-[15em] bg-white text-black flex justify-center items-center relative`}
    >
      <section className={`text-2xl z-20 w-full pl-24`}>
        <p>&copy; 2023 Alright Reserve</p>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </section>
      <div
        className={`absolute left-0 bottom-0 w-[41.2em] h-full ${footerSky}`}
      ></div>

      {/* <section className="fcontainer">
        <p>&copy; 2023 RPG Prostock. All Rights Reserved.</p>
        <div className="social-media">
          <a
            href="https://www.facebook.com/pages/RPG-Distribution-Services-Inc/183954811722273"
            target="_blank"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </section> */}
    </div>
  );
}
