import React from "react";
import { Link } from "react-router-dom";

const Otherpage = () => {
  return (
    <div>
      <h1>Some other page</h1>
      <Link to="/">Go back</Link>
    </div>
  );
};

export default Otherpage;
