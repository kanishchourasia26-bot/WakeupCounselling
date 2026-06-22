import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="shadow-md bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">
          WakeUp Counselling
        </h1>

        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="border px-4 py-2 rounded-lg"
          >
            Login
          </Link>

          <Link
            to="/book-appointment"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Book Appointment
          </Link>
        </div>

      </div>
    </nav>
  );
}