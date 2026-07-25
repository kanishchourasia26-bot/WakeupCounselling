import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function Services() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    API.get('/content/events').then(r => setEvents(r.data.events || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="text-teal-200 mt-3">Services we provide</p>
        </div>
      </div>
      <section className="py-24 bg-white">
  <div className="container mx-auto px-6">


    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Counselling */}
      <Link
        to="/services/counselling"
        className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="h-52 overflow-hidden">
          <img
            src="/images/counselling.jpg"
            alt="Counselling"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        </div>

        <div className="p-7">
          <h3 className="text-2xl font-bold text-[#2F5D62] mb-3">
            Counselling
          </h3>

          <p className="text-gray-600 leading-7">
            Professional counselling sessions to improve emotional well-being,
            relationships and confidence.
          </p>

          <span className="mt-6 inline-flex items-center font-semibold text-[#2F5D62]">
            Learn More →
          </span>
        </div>
      </Link>

      {/* Career Guidance */}

      <Link
        to="/services/career-guidance"
        className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="h-52 overflow-hidden">
          <img
            src="/images/career.jpg"
            alt="Career Guidance"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        </div>

        <div className="p-7">
          <h3 className="text-2xl font-bold text-[#2F5D62] mb-3">
            Career Guidance
          </h3>

          <p className="text-gray-600 leading-7">
            Expert guidance to help students and professionals choose the right
            educational and career path.
          </p>

          <span className="mt-6 inline-flex items-center font-semibold text-[#2F5D62]">
            Learn More →
          </span>
        </div>
      </Link>

      {/* Therapy */}

      <Link
        to="/services/therapy-sessions"
        className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="h-52 overflow-hidden">
          <img
            src="/images/thereapy.jpg"
            alt="Therapy Sessions"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        </div>

        <div className="p-7">
          <h3 className="text-2xl font-bold text-[#2F5D62] mb-3">
            Therapy Sessions
          </h3>

          <p className="text-gray-600 leading-7">
            Individual and family therapy sessions focused on healing,
            resilience and long-term mental wellness.
          </p>

          <span className="mt-6 inline-flex items-center font-semibold text-[#2F5D62]">
            Learn More →
          </span>
        </div>
      </Link>

      {/* Workshops */}

      <Link
        to="/services/workshop"
        className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="h-52 overflow-hidden">
          <img
            src="/images/workshop.jpg"
            alt="Workshops"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        </div>

        <div className="p-7">
          <h3 className="text-2xl font-bold text-[#2F5D62] mb-3">
            Workshops
          </h3>

          <p className="text-gray-600 leading-7">
            Interactive awareness programs, training sessions and mental health
            workshops for schools and organizations.
          </p>

          <span className="mt-6 inline-flex items-center font-semibold text-[#2F5D62]">
            Learn More →
          </span>
        </div>
      </Link>

      {/* Psychological Tests */}

      <Link
        to="/services/psychological-tests"
        className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="h-52 overflow-hidden">
          <img
            src="/images/test.jpg"
            alt="Psychological Tests"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        </div>

        <div className="p-7">
          <h3 className="text-2xl font-bold text-[#2F5D62] mb-3">
            Psychological Tests
          </h3>

          <p className="text-gray-600 leading-7">
            Standardized assessments to understand personality, aptitude,
            intelligence and emotional health.
          </p>

          <span className="mt-6 inline-flex items-center font-semibold text-[#2F5D62]">
            Learn More →
          </span>
        </div>
      </Link>

    </div>

  </div>
</section>
   
    </div>
  );
}
