import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-2xl font-bold mb-4">
          WakeUp Counselling
        </h2>

        <p className="text-gray-400 mb-8">
          Supporting emotional well-being through professional counselling.
        </p>

        <div className="flex gap-6 mb-8">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <hr className="border-gray-700 mb-6" />

        <p className="text-gray-400">
          © 2026 WakeUp Counselling. All rights reserved.
        </p>

      </div>
    </footer>
  );
}