export default function Testimonials() {
  const testimonials = [
    {
      name: "Student",
      review:
        "The counselling sessions helped me gain confidence and clarity about my future career path.",
    },
    {
      name: "Parent",
      review:
        "Professional guidance and a supportive approach helped our family navigate difficult challenges.",
    },
    {
      name: "Working Professional",
      review:
        "I learned practical strategies to manage stress and improve my overall well-being.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-4">
          What Our Clients Say
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Real experiences from people we have helped.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="text-yellow-500 text-xl mb-4">
                ★★★★★
              </div>

              <p className="text-gray-600 mb-6">
                "{item.review}"
              </p>

              <h3 className="font-semibold">
                {item.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}