import React from "react";

export default function Footer() {
  return (
    <div>
      <section>
        <p>&copy; 2023 Alright Reserve</p>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </section>

      <section className="fcontainer">
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
      </section>
    </div>
  );
}
