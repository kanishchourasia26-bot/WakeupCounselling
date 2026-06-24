import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Professional Counselling for a
            <span className="text-blue-600"> Better Tomorrow</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Helping children, students, parents and individuals overcome
            emotional challenges, build confidence and achieve personal growth.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/book-appointment"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Book Appointment
            </Link>

            <Link
              to="/about"
              className="border border-gray-300 px-6 py-3 rounded-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6">
            Why Choose WakeUp Counselling?
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">✓ 10+ Years Experience</h3>
            </div>

            <div>
              <h3 className="font-semibold">
                ✓ Professional Psychological Guidance
              </h3>
            </div>

            <div>
              <h3 className="font-semibold">
                ✓ Child & Career Counselling
              </h3>
            </div>

            <div>
              <h3 className="font-semibold">
                ✓ Confidential Sessions
              </h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}