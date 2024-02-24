import React, { useEffect, useState } from "react";

const Fib = () => {
  const [seenIndex, setSeenIndex] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  async function fetchValues() {
    const values = await fetch("/api/values/current", {
      method: "GET",
    });
    setValues(values.data);
  }

  async function fetchIndexes() {
    const indexes = await fetch("/api/values/all", {
      method: "GET",
    });
    setSeenIndex(indexes);
  }

  function renderValues() {
    const entries = [];
    for (let key in values) {
      if (key) {
        entries.push(
          <div key={key}>
            For index {key} I calculated {values[key]}
          </div>
        );
      }
    }
    return entries;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch("/api/values", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(index),
    });
    setIndex("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="index">Enter your Index:</label>
        <input
          type="number"
          name="index"
          id="index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button>submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {seenIndex?.data?.map((obj, i) => (
        <p key={i}>{obj?.number}</p>
      ))}
      <h3>Calculated values:</h3>
      {renderValues()?.map((obj) => obj)}
    </div>
  );
};

export default Fib;
