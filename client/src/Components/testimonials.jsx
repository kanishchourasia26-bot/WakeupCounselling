export default function Testimonials() {
  const testimonials = [
    {
      name: "Student",
      feedback:
        "The counselling sessions helped me gain clarity about my career path and boosted my confidence.",
    },
    {
      name: "Parent",
      feedback:
        "The guidance provided practical solutions and improved communication within our family.",
    },
    {
      name: "Working Professional",
      feedback:
        "I learned effective ways to manage stress and maintain a healthier work-life balance.",
    },
  ];

  return (
    <section className="py-20 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          What People Say
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Experiences shared by individuals who have benefited from counselling.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <p className="text-gray-600 mb-4">
                "{item.feedback}"
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