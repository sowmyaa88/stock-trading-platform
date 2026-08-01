import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">People</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-3 text-center">
          <img
            src="media/images/sowmyaa88.svg"
            style={{ borderRadius: "100%", width: "50%" }}
            alt="sowmyaa88"
          />
          <h4 className="mt-5">sowmyaa88</h4>
          <h6>Founder & Lead Developer</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            sowmyaa88 designed and developed the Stock Trading Platform to create a modern, high-performance financial experience for retail investors and active traders.
          </p>
          <p>
            Built with modern technology stacks including React.js, Express, and Node.js for ultra-fast trade processing and portfolio analytics.
          </p>
          <p>Passionate about open source software and modern web applications.</p>
        </div>
      </div>
    </div>
  );
}

export default Team;
