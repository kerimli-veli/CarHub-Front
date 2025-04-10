import { FaRegCreditCard, FaExchangeAlt, FaMoneyBillWave, FaMobileAlt, FaFileInvoice, FaChartLine, FaSave, FaUser } from "react-icons/fa";
import React from "react";

const options = [
  { icon: <FaRegCreditCard />, label: "Şəxsi və kart", link: "#" },
  { icon: <FaExchangeAlt />, label: "Transfer", link: "#" },
  { icon: <FaMoneyBillWave />, label: "Hesabdan çıxar", link: "#" },
  { icon: <FaMobileAlt />, label: "Mobil öncədən ödəniş", link: "#" },
  { icon: <FaFileInvoice />, label: "Layihəni ödə", link: "#" },
  { icon: <FaSave />, label: "Online yadda saxla", link: "#" },
  { icon: <FaChartLine />, label: "Kredit kartı", link: "#" },
  { icon: <FaFileInvoice />, label: "Əməliyyat hesabatı", link: "#" },
  { icon: <FaUser />, label: "Benefisiar", link: "#" },
];

const OptionsPanel = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-72">
      <h2 className="text-lg font-semibold mb-4">İstifadə Tarixi</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <a
            key={index}
            href={option.link}
            className="flex flex-col items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <div className="text-blue-600 text-2xl">{option.icon}</div>
            <p className="text-sm text-gray-700 mt-2 text-center">{option.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default OptionsPanel;