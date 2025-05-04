import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import React from 'react';

const AuctionCarInfo = () => {
  const location = useLocation();
  const { carId, userId } = location.state || {}; 

  const [carInfo, setCarInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  return (
    <div className="">
    </div>
  );
};

export default AuctionCarInfo;
