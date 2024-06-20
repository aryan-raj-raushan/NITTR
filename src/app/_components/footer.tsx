
import Link from 'next/link';
import { Button } from '~/components/ui/button';



export const footerNavigation = {
  company: [
    { name: 'About Us', href: '/' },
    { name: 'Legal Information', href: '/' },
    { name: 'Contact Us', href: '/' },
    { name: 'Blogs', href: '/' },
  ],
  helpCenter: [
    { name: 'Find A Property', href: '/' },
    { name: 'How to Host ?', href: '/' },
    { name: 'Why Us ?', href: '/' },
    { name: 'FAQs', href: '/' },
    { name: 'Rental Guides', href: '/' },
  ],
  contactInfo: [
    { name: 'Phone:1234567890', href: '/' },
    { name: 'Email:company@email.com', href: '/' },
    { name: 'Location:100 smart street', href: '/' },
  ],
};

const Footer = () => {
  return (
    // <footer aria-labelledby="footer-heading">
    //  <h2 id="footer-heading" className="sr-only">
    //    Footer
    //  </h2>

    //  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    //    <div className="border-t border-gray-200 py-20">
    //      <div className="grid grid-cols-1 md:grid-flow-col md:auto-rows-min md:grid-cols-12 md:gap-x-8 md:gap-y-16">
    //        {/* Image section */}
    //        <div className="col-span-1 md:col-span-2 lg:col-start-1 lg:row-start-1">
    //          <div className="md:col-span-8 md:col-start-3 md:row-start-2 lg:col-span-4 lg:col-start-1 lg:row-start-1  justify-center items-center flex flex-col gap-4">
    //            <h1 className="text-5xl font-medium text-gray-900">
    //              LOGO
    //            </h1>
    //          </div>
    //        </div>

    //        {/* Sitemap sections */}

    //        <div className="col-span-6 mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:col-start-3 md:row-start-1 md:mt-0 lg:col-span-6 lg:col-start-6">
    //          <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
    //            <div>
    //              <h3 className="text-sm font-medium text-gray-900">
    //                Company
    //              </h3>
    //              <ul role="list" className="mt-6 space-y-6">
    //                {footerNavigation.company.map((item) => (
    //                  <li key={item.name} className="text-sm">
    //                    <Link
    //                      href={item.href}
    //                      className="text-gray-500 hover:text-gray-600"
    //                    >
    //                      {item.name}
    //                    </Link>
    //                  </li>
    //                ))}
    //              </ul>
    //            </div>
    //            <div>
    //              <h3 className="text-sm font-medium text-gray-900">Help Center</h3>
    //              <ul role="list" className="mt-6 space-y-6">
    //                {footerNavigation.helpCenter.map((item) => (
    //                  <li key={item.name} className="text-sm">
    //                    <Link
    //                      href={item.href}
    //                      className="text-gray-500 hover:text-gray-600"
    //                    >
    //                      {item.name}
    //                    </Link>
    //                  </li>
    //                ))}
    //              </ul>
    //            </div>
    //          </div>
    //          <div>
    //            <h3 className="text-sm font-medium text-gray-900">
    //              Contact Info
    //            </h3>
    //            <ul role="list" className="mt-6 space-y-6">
    //              {footerNavigation.contactInfo.map((item) => (
    //                <li key={item.name} className="text-sm">
    //                  <Link
    //                    href={item.href}
    //                    className="text-gray-500 hover:text-gray-600"
    //                  >
    //                    {item.name}
    //                  </Link>
    //                </li>
    //              ))}
    //            </ul>
    //          </div>
    //        </div>

    //        {/* Newsletter section */}
    //      </div>
    //    </div>

    //    <div className="border-t border-gray-100 py-10 text-center">
    //      <p className="text-sm text-gray-500">
    //        &copy; 2024 {process.env.siteName}. All rights reserved.
    //      </p>
    //    </div>
    //  </div>
    //</footer>
    <footer>
      <div className="border-t border-gray-100 py-10 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2024 {process.env.siteName}. All rights reserved. NITTTR , Bhopal
        </p>
      </div>
    </footer>
  );
};
export default Footer;
