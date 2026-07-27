import { Link } from 'react-router-dom';
import { HiUsers, HiAcademicCap, HiHeart, HiArrowRight, HiStar, HiLocationMarker } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  HiShieldCheck,
  HiUserGroup,
  HiSparkles,
} from "react-icons/hi2";
import { FiAward, FiBookOpen, FiMapPin } from "react-icons/fi";
export default function Home() {
  const [banners, setBanners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [cms, setCms] = useState({});

  useEffect(() => {
    API.get('/content/banners').then(r => setBanners(r.data.banners || [])).catch(() => {});
    API.get('/content/testimonials').then(r => setTestimonials(r.data.items || [])).catch(() => {});
    API.get('/content/workshops').then(r => setWorkshops((r.data.workshops || []).filter(w => w.isFeatured).slice(0, 3))).catch(() => {});
    API.get('/content/events').then(r => setEvents(r.data.events || [])).catch(() => {});
    API.get('/content/gallery').then(r => setGallery(r.data.items || [])).catch(() => {});
    Promise.all([
      API.get('/content/cms/home_panel_1'),
      API.get('/content/cms/home_panel_2'),
      API.get('/content/cms/home_panel_3'),
      API.get('/content/cms/about')
    ]).then(([r1, r2, r3, r4]) => {
      setCms({ panel1: r1.data.item, panel2: r2.data.item, panel3: r3.data.item, about: r4.data.item });
    }).catch(() => {});
  }, []);

  const panels = [
    { icon: HiUsers, data: cms.panel1 },
    { icon: HiHeart, data: cms.panel2 },
    { icon: HiAcademicCap, data: cms.panel3 }
  ];

  return (
    <div>
  {/* Hero */}
  {/* Hero */}
    <section
      className="relative text-white overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(17, 24, 39, 0.55),
            rgba(17, 24, 39, 0.55)
          ),
          url('/images/hero.jpg')
        `,
      }}
    >
      <div className="container mx-auto px-10 py-20 md:py-24 relative z-10">
        <div className="max-w-3xl">
          
          {/* 1. Top text with the vertical orange bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-14 sm:h-12 bg-amber-500 rounded-sm"></div>
            <p className="text-white text-base md:text-xl font-medium leading-snug tracking-wide">
              Wake Up Mental Health And Psychology <br className="hidden sm:block" />
              Counseling Center Jabalpur
            </p>
          </div>

          {/* 2. Main Heading (Uppercase and Extrabold) */}
          <h1 className="font-heading text-4xl md:text-[56px] font-extrabold uppercase leading-tight tracking-wide mb-10">
            Giving Counseling <br />
            Services From 2015
          </h1>

          {/* 3. Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/about"
              className="inline-flex items-center justify-center bg-white px-8 py-3.5 rounded text-base font-bold text-gray-900 shadow-md transition-colors hover:bg-gray-100"
            >
              Read More
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-amber-500 px-8 py-3.5 rounded text-base font-bold text-white shadow-md transition-colors hover:bg-amber-600"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </section>

   {/* Info Panels */}
<section className="py-24 bg-white">
  <div className="container mx-auto px-4 md:px-8 max-w-7xl">
    
    {/* Section Header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#2F3768] leading-tight">
        Supporting Your Mental Wellness
      </h2>
      <p className="mt-6 text-gray-600 text-lg leading-relaxed">
        We provide compassionate psychological care, emotional support and
        professional guidance tailored to every individual's needs.
      </p>
    </div>

    {/* NAYE BOXES (Image ke design ke according) */}
    <div className="grid md:grid-cols-3 gap-8">
      {panels.map((panel, index) => {
        const Icon = panel.icon;

        return (
          <div
            key={index}
            // Sharp corners (no rounded class), soft shadow, centered content
            className="relative bg-white px-8 py-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
          >
            {/* Left Side ki Orange Accent Line (Jo top se aadhi height tak aati hai) */}
            <div className="absolute top-0 left-0 w-1.5 h-[55%] bg-amber-500"></div>

            {/* Icon - Orange Color, Bina kisi background ke, Size bada kar diya hai */}
            <Icon
              size={56}
              className="text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300"
            />

            {/* Title */}
            <h3 className="font-heading text-xl md:text-2xl font-bold text-[#2F3768] mb-4">
              {panel.data?.title || "Loading..."}
            </h3>

            {/* Description Text */}
            <p className="text-gray-600 leading-relaxed text-base">
              {panel.data?.body || ""}
            </p>
          </div>
        );
      })}
    </div>

  </div>
</section>
{/* About */}
<section className="py-24 bg-white overflow-hidden">
  <div className="container mx-auto px-4">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* Left */}
      <div>

        <div className="flex items-center gap-3 mb-5">
          <span className="w-1 h-8 rounded-full bg-amber-400"></span>

          <span className="uppercase tracking-widest text-[#2F3768] font-semibold text-sm">
            About Us
          </span>
        </div>

        <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#2F3768] leading-tight mb-8">
          A Healthy Mind Creates a
          <br />
          Better Life.
        </h2>

        <p className="text-lg leading-8 text-gray-600 mb-8">
          At <strong>Wake Up Psychology Counseling Center</strong>, we provide
          professional psychological counselling with empathy, care and
          confidentiality. Our mission is to help individuals overcome
          emotional, behavioural and mental health challenges through
          evidence-based counselling.
        </p>

        <p className="text-lg leading-8 text-gray-600 mb-10">
          Every person is unique. Our counselling approach is designed to
          strengthen confidence, improve emotional well-being and guide people
          towards a healthier personal and social life.
        </p>

        <Link
          to="/about"
          className="inline-flex items-center gap-3 bg-[#2F3768] text-white px-7 py-4 rounded-xl font-semibold hover:bg-[#26305b] transition"
        >
          Learn More
          <HiArrowRight />
        </Link>

      </div>

      {/* Right Images */}
      <div className="relative h-[600px]">

        {/* Main Image */}
        <img
          src="/images/coun.jpg"
          alt="Counselling"
          className="absolute right-0 top-0 w-[78%] h-[430px] rounded-3xl object-cover shadow-2xl"
        />

        {/* Top Card */}
        <div className="absolute top-8 left-0 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 w-56">

          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
            <HiHeart className="text-amber-500 text-2xl" />
          </div>

          <h4 className="font-heading text-[#2F3768] font-bold text-lg mb-2">
            Compassion
          </h4>

          <p className="text-gray-600 text-sm leading-6">
            Professional care with empathy and complete confidentiality.
          </p>

        </div>

        {/* Bottom Card */}
        <div className="absolute bottom-0 right-8 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 w-60">

          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
            <HiUsers className="text-[#2F3768] text-2xl" />
          </div>

          <h4 className="font-heading text-[#2F3768] font-bold text-lg mb-2">
            Expert Guidance
          </h4>

          <p className="text-gray-600 text-sm leading-6">
            Helping individuals build confidence, resilience and emotional
            strength.
          </p>

        </div>

      </div>

    </div>

  </div>

      </section>
{/* Achievements */}
<section className="py-24 bg-white overflow-hidden">
  <div className="container mx-auto px-4">

    <div className="grid lg:grid-cols-2">

      {/* LEFT */}
      <div className="relative bg-[#223543] text-white px-10 md:px-16 py-20 overflow-hidden">

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -left-24 top-0 w-96 h-96 border border-white rotate-45"></div>
          <div className="absolute left-24 bottom-0 w-[500px] h-[500px] border border-white rotate-45"></div>
        </div>

        <div className="relative z-10">

          <div className="flex items-center gap-4 mb-6">

            <span className="w-1 h-10 bg-white rounded-full"></span>

            <span className="uppercase tracking-[3px] text-sm text-amber-400 font-semibold">
              Why Choose Us
            </span>

          </div>

          <h2 className="text-5xl font-bold mb-16">
            Achievements
          </h2>

          <div className="grid grid-cols-3 gap-10">

            {[
              {
                icon: FiAward,
                value: "25",
                label: "Events"
              },
              {
                icon: FiBookOpen,
                value: "328",
                label: "Counselling"
              },
              {
                icon: FiMapPin,
                value: "1",
                label: "Location"
              }
            ].map((item, i) => {

              const Icon = item.icon;

              return (

                <div key={i}>

                  <Icon
                    className="text-5xl mb-8 text-white"
                  />

                  <h3 className="text-5xl font-bold">
                    {item.value}
                  </h3>

                  <div className="w-20 h-1 bg-amber-400 my-6"></div>

                  <p className="text-xl text-gray-200">
                    {item.label}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </div>

      {/* RIGHT IMAGE */}

      <div className="h-[650px]">

        <img
          src="/images/2.jpg"
          alt="Counselling"
          className="w-full h-full object-cover"
        />

      </div>

    </div>

  </div>
</section>
{/* Notices & Services */}
<section className="py-24 bg-white">
  <div className="container mx-auto px-4">

    {/* Heading */}
    <div className="mb-16 max-w-4xl">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1 h-8 rounded-full bg-amber-400"></span>

        <span className="uppercase tracking-wider text-[#2F3768] font-semibold text-sm">
          Upcoming Events
        </span>
      </div>

      <h2 className="font-heading text-4xl md:text-5xl font-bold leading-tight text-[#2F3768]">
        Stay Updated with Our Latest
        <br />
        News & Counselling Programs
      </h2>
    </div>

    <div className="grid lg:grid-cols-2 gap-10">

      {/* Notices */}

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">

        <h3 className="text-4xl font-heading font-bold text-[#2F3768] mb-10">
          Notices
        </h3>

        <div className="space-y-8">

          {[
            "If you are experiencing stress, anxiety, fear or emotional discomfort, our professional counsellors are here to support you.",

            "Online appointment booking is now available for counselling sessions.",

            "Weekend counselling sessions can be booked in advance."
          ].map((item, index) => (

            <div
              key={index}
              className="flex gap-5"
            >

              <div className="mt-1">

                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">

                  <HiShieldCheck
                    className="text-amber-500"
                    size={18}
                  />

                </div>

              </div>

              <p className="text-gray-600 leading-8 text-lg">
                {item}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Services */}

      <div>

        <h3 className="text-4xl font-heading font-bold text-[#2F3768] mb-8">
          Our Services
        </h3>

        <div className="space-y-5">

          {[
            "Psychological Assessment",

            "Career Counselling",

            "Relationship Counselling",

            "Stress & Anxiety Therapy",

            "Child & Adolescent Counselling"
          ].map((service, index) => (

            <Link
              key={index}
              to="/services"
              className="group flex items-center justify-between border-b border-gray-200 py-6 transition"
            >

              <div className="flex items-center gap-5">

                <span className="w-6 h-3 rounded-full bg-amber-400 group-hover:w-8 transition-all"></span>

                <span className="font-heading font-bold text-2xl text-[#2F3768] group-hover:text-amber-500 transition">
                  {service}
                </span>

              </div>

              <HiArrowRight
                className="text-[#2F3768] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                size={24}
              />

            </Link>

          ))}

        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-3 mt-10 text-[#2F3768] font-semibold text-lg hover:text-amber-500 transition"
        >
          View All Services
          <HiArrowRight />
        </Link>

      </div>

    </div>

  </div>
</section>
    </div>
  );
}