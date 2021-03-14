import React, {useEffect, useState} from "react";
import Moment from "react-moment";
import "./clock.scss";

const Clock = () => {

  const [currDate, setCurrDate] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setCurrDate(new Date())
    }, 1000);
  }, []);

  return (
    <div className="current-date">
      <Moment className="current-date__date" format="DD/MM/YYYY" >{currDate}</Moment>
      <Moment format="HH:mm" >{currDate}</Moment>
    </div>
  );
};

export default Clock;
