import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const footerLinks = [
    {
      title: "Customer Support",
      links: [
        { label: "Get Help", href: "/support" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "For Businesses",
      links: [
        { label: "Contact Sales", href: "/business/contact" },
        { label: "Business FAQ", href: "/business/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  const socialLinks = [
    { id: "facebook", icon: "/icons/facebook.svg", label: "Facebook", href: "https://facebook.com" },
    { id: "instagram", icon: "/icons/instagram.svg", label: "Instagram", href: "https://instagram.com" },
    { id: "linkedin", icon: "/icons/linkedin.svg", label: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <footer className="px-4 sm:px-6 lg:px-15 mt-16 sm:mt-20 mb-12">
      <div className="px-4 sm:px-8 lg:px-15 py-8 sm:py-12 lg:py-16 rounded-2xl sm:rounded-3xl bg-green-50">
        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Newsletter Section */}
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Stay Connected with Us!
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              Subscribe to our newsletter for the latest updates.
            </p>

            <button className="
              mt-6
              sm:mt-8
              group
              w-full
              border border-black
              rounded-full
              flex items-center
              justify-between
              pl-4
              sm:pl-6
              pr-2
              py-2
              sm:py-3
              transition-all
              duration-300
              ease-out
              hover:bg-black
              hover:text-white
              hover:shadow-lg
              hover:shadow-black/20
              active:scale-95
            ">
              <span className="text-sm sm:text-base font-bold tracking-tight">
                Newsletter
              </span>

              <div className="
                w-10
                sm:w-12
                h-10
                sm:h-12
                rounded-full
                bg-black
                flex items-center
                justify-center
                group-hover:bg-white
                transition-all
                duration-300
                group-hover:scale-110
                flex-shrink-0
              ">
                <ArrowRight
                  className="
                    text-white
                    group-hover:text-black
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                  "
                  size={20}
                  strokeWidth={2.5}
                />
              </div>
            </button>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="text-xl sm:text-2xl font-bold">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        text-sm
                        sm:text-base
                        text-gray-700
                        hover:text-black
                        transition-colors
                        duration-200
                        hover:underline
                        underline-offset-2
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4">
          {/* Copyright */}
          <p className="text-sm sm:text-base text-gray-600">
            © 2024 Coom endem. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 sm:gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.id}
                href={social.href}
                className="
                  group
                  transition-transform
                  duration-300
                  hover:scale-110
                  active:scale-95
                "
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={social.icon}
                  width={40}
                  height={40}
                  alt={social.label}
                  className="
                    opacity-70
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                  "
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}