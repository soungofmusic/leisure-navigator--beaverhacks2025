import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Leisure Navigator. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-sm text-gray-500 hover:text-primary-600">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-600">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-600">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
