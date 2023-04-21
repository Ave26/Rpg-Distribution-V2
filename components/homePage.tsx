// import React from "react";
// import Image from "next/image";
// import RPG from "../public/RPG.png";
// import Link from "next/link";
// import styles from "../styles/home.module.css";

// import "./home.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

// export default function HomePage() {
//     function showLoginPopup() {
//         var loginPopup = document.getElementById("login-popup");
//         var header = document.getElementById("header");
//         loginPopup.classList.add("visible");
//         header.style.display = "none";
//         loginPopup.innerHTML = '<iframe src="login.html"></iframe>';
//       }

//       return (
//         <React.Fragment>
//           <header id="header">
//             <img src="RPG.png" alt="logo" className="logo" />
//             <nav className="navigation">
//               <a href="#" className="nav__list">
//                 Home
//               </a>
//               <a href="#" className="nav__list">
//                 Product Catalog
//               </a>
//               <a href="#" className="nav__list">
//                 About us
//               </a>
//               <button className="btnLogin-popup" onClick={showLoginPopup}>
//                 Login
//               </button>
//             </nav>
//           </header>
//           <div id="login-popup"></div>
//           <div className="wrapper">
//             <div className="container">
//               <h1 style={{ textAlign: "center" }}>
//                 Welcome to RPG Prostock!
//               </h1>
//               <p style={{ textAlign: "center" }}>
//                 Take Control of Your Warehouse with Prostock:{" "}
//               </p>
//               <p style={{ textAlign: "center" }}>
//                 The Ultimate Solution for Streamlined Management and Effortless
//                 Shopping!{" "}
//               </p>
//               <p style={{ textAlign: "center" }}>
//                 To know more about our company click the button below!{" "}
//               </p>
//               <button
//                 className="btnKnow-popup"
//                 onClick={() => window.open("https://rpg-ph.com", "_blank")}
//               >
//                 Learn More
//               </button>
//             </div>
//             <div className="video-container">
//               <video autoPlay muted loop>
//                 <source src="homepage.mp4" type="video/mp4" />
//               </video>
//             </div>
//           </div>
//           <footer>
//             <div className="fcontainer">
//               <p>&copy; 2023 RPG Prostock. All Rights Reserved.</p>
//               <div className="social-media">
//                 <a
//                   href="https://www.facebook.com/pages/RPG-Distribution-Services-Inc/183954811722273"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <FontAwesomeIcon icon={faFacebook} />
//                 </a>
//                 <a href="#">
//                   <FontAwesomeIcon icon={faTwitter} />
//                 </a>
//                 <a href="#">
//                   <FontAwesomeIcon icon={faInstagram} />
//                 </a>
//               </div>
//             </div>
//           </footer>
//     </div>
//   );
// }
