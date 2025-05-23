import React, { useEffect, useState } from 'react';
import getUserFromToken from './../../common/GetUserFromToken';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserIcon, Clock, Mail } from 'lucide-react';

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  const [senderNames, setSenderNames] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user = getUserFromToken();
        const receiverId = user?.id;
        if (!receiverId) return;

        const res = await fetch(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Chat/getUserMessages?ReceiverId=${receiverId}`);
        if (!res.ok) throw new Error("Mesajlar tapılmadı");

        const data = await res.json();

        const groupedMessages = Object.values(
          data.reduce((acc, msg) => {
            if (!acc[msg.senderId] || new Date(msg.sentAt) > new Date(acc[msg.senderId].sentAt)) {
              acc[msg.senderId] = msg;
            }
            return acc;
          }, {})
        );

        setMessages(groupedMessages);

        const senderIds = groupedMessages.map(msg => msg.senderId);
        const nameMap = {};
        await Promise.all(senderIds.map(async id => {
          const res = await fetch(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/User/GetById?Id=${id}`);
          if (res.ok) {
            const json = await res.json();
            nameMap[id] = `${json.data.name} ${json.data.surname}`;
          } else {
            nameMap[id] = `ID: ${id}`;
          }
        }));
        setSenderNames(nameMap);
      } catch (err) {
        console.error('Xəta baş verdi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Yüklənir...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bildirişlər</h2>
      <ul className="space-y-4">
        {messages.map((msg) => (
          <li key={msg.id}>
            <div
              onClick={() => navigate(`/messages/${msg.senderId}`, { state: { background: location } })}
              style={{ cursor: "pointer" }}
              className="block transition hover:scale-[1.01] hover:shadow-lg bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-gray-700">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-medium">{senderNames[msg.senderId] || `ID: ${msg.senderId}`}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(msg.sentAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-start text-gray-800 mt-2">
                <Mail className="w-4 h-4 mt-1 mr-2 text-indigo-500" />
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
