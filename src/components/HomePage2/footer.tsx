import Image from "next/image";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import logo from "public/nitttrLogo.png";

const Footer = () => {
  const quickLinks = [
    { href: "https://nitttrbpl.ac.in/about.php", text: "About Us" },
    { href: "https://nitttrbpl.ac.in/photo_gallery.php", text: "Photo Gallery" },
    { href: "https://nitttrbpl.ac.in/women-cell.php", text: "Women Cell" },
    { href: "https://nitttrbpl.ac.in/Newspaper.php", text: "News" },
    { href: "https://nitttrbpl.ac.in/minority_cell.php", text: "SC/ST/OBC/PWD/Minority Cell" },
    { href: "https://nitttrbpl.ac.in/files/calendar2425.pdf", text: "CALENDAR 2024-2025" },
  ];

  const importantLinks = [
    { href: "https://nitttrbpl.ac.in/other-nitttr.php", text: "Other NITTTR's" },
    { href: "https://nitttrbpl.ac.in/article.php", text: "Articles" },
  ];

  return (
    <footer className="w-full bg-primaryBackground py-10 text-white">
      <div className="mx-auto flex flex-col md:flex-row max-w-[1280px] px-4 md:px-10">
        <div className="flex w-full md:w-1/3 flex-col items-start justify-start mb-8 md:mb-0">
          <div className="flex flex-col items-start gap-4">
            <Image
              src={logo}
              alt={"NITTTR"}
              width={500}
              height={500}
              className="mt-2 h-20 w-20"
            />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">NITTTR</h2>
              <p className="text-sm">
                Experience comfort and freedom in our vibrant hostel. Whether
                you're traveling solo or in a group, our welcoming environment
                ensures a memorable stay.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full md:w-1/3 flex-col items-start md:items-center justify-start mb-8 md:mb-0">
          <ul className="mt-4 flex  flex-col gap-2">
          <h2 className="text-xl mb-2 font-bold">Quick links</h2>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" className="hover:underline" rel="noopener noreferrer">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-full md:w-1/3 flex-col items-start md:items-center justify-start">
          <ul className="mt-4 flex flex-col gap-2">
          <h2 className="text-xl mb-2 font-bold">Important Links</h2>
            {importantLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" className="hover:underline" rel="noopener noreferrer">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
