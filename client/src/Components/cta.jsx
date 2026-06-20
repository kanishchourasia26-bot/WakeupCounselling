import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-6">
          Take the First Step Towards
          Better Mental Well-Being
        </h2>

        <p className="text-xl text-gray-600 mb-8">
          Professional guidance and support can help you navigate
          challenges and achieve personal growth.
        </p>

        <Link
          to="/book-appointment"
          className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium"
        >
          Book Appointment
        </Link>
      </div>
    </section>
  );
}