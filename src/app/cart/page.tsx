'use client';

import { api } from "~/trpc/server";
import Footer from "../_components/footer";

export default function CartWithItem() {
  return (
    <div className="bg-white">
      {' '}
      {/* Mobile menu */}
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Checkout Your Bookings
        </h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <div className="sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
              <label
                htmlFor="discount-code"
                className="block text-sm font-medium text-gray-700"
              >
                Discount code
              </label>
              <div className="mt-1 flex space-x-4">
                <input
                  onChange={(e) => { }}
                  type="text"
                  id="discount-code"
                  name="discount-code"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  onClick={() => { }}
                  type="button"
                  className="rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Apply
                </button>
              </div>

              <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">{}</dd>
                </div>
                <div
                  className={`flex justify-between `}
                >
                  <dt className="flex">
                    Discount
                    <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                      {"discount-code"}
                    </span>
                  </dt>
                  <dd className="text-gray-900">-{}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd className="text-gray-900">
                    {}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">{}</dd>
                </div>
              </dl>
            </div>
          </section>
        </form>

        {/* Related products */}
      </main>
      <Footer></Footer>
    </div>
  );
}
