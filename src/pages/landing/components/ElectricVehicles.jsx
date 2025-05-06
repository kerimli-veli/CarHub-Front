import React from "react";

const features = [
  {
    id: 1,
    icon: "https://i.postimg.cc/MH9phLXJ/f1-svg.jpg",
    title: "Special Financing Offers",
    description: "Our stress-free finance department that can find financial solutions to save you money.",
  },
  {
    id: 2,
    icon: "https://i.postimg.cc/yY5VccZj/f2-svg.jpg",
    title: "Trusted Car Dealership",
    description: "Our stress-free finance department that can find financial solutions to save you money.",
  },
  {
    id: 3,
    icon: "https://i.postimg.cc/QtXshq28/f3-svg.jpg",
    title: "Transparent Pricing",
    description: "Our stress-free finance department that can find financial solutions to save you money.",
  },
  {
    id: 4,
    icon: "https://i.postimg.cc/7hhkTZPj/f4-svg.jpg",
    title: "Expert Car Service",
    description: "Our stress-free finance department that can find financial solutions to save you money.",
  },
];

export default function ElectricVehicles() {
  return (
    <section className="max-w-8xl mx-auto px-6 gap-70 py-20 grid md:grid-cols-[1.2fr_2fr] gap-16">
      <div className="flex flex-col justify-start">
        <h2 className="text-4xl font-bold text-gray-900 leading-tight">
          Why Electric Vehicles?
        </h2>
        <p className="text-gray-600 text-lg mt-4">
          We are committed to providing our customers with exceptional service, competitive pricing, and a wide range of options.
        </p>
        <a
          href="#"
          className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
        >
          Get Started →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col items-start space-y-3">
            <img src={feature.icon} alt={feature.title} className="w-12 h-12" />
            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
