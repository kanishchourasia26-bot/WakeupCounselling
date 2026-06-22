export default function WhyChooseUs() {
  const features = [
    {
      title: "Professional Guidance",
      description:
        "Receive support and guidance from an experienced and qualified counselling professional.",
    },
    {
      title: "Confidential Sessions",
      description:
        "Your privacy and trust are our priority. Every session is conducted in a safe and confidential environment.",
    },
    {
      title: "Personalized Approach",
      description:
        "Every individual is unique, and counselling sessions are tailored to your specific needs and goals.",
    },
    {
      title: "Supportive Environment",
      description:
        "A compassionate and non-judgmental space where you can express yourself freely.",
    },
  ];

  return (
    <section className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Why Choose Us
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Dedicated to helping individuals achieve emotional well-being,
          personal growth, and a healthier mindset.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}