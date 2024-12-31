import React, { useEffect, useState } from "react";
import "./circularLoader.css";

interface CircularLoaderProps {
  status: "RUNNING" | "PUBLISHED" | "SUCCESS";
}

const CircularLoader: React.FC<CircularLoaderProps> = ({ status }) => {
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [dot, setDot] = useState<number>(0);
  const [text, setText] = useState<string>("00");

  useEffect(() => {
    if (status !== "RUNNING") return; // Only run the timer when status is "RUNNING"

    let count = 0;
    const totalSeconds = 120;

    const interval = setInterval(() => {
      count++;
      const elapsedSeconds: number = count; // Track elapsed time with `count`

      const currLoadPercentage = 440 - 440 * (elapsedSeconds / totalSeconds);
      setLoadingPercent(currLoadPercentage);

      const currPoint = 360 * (elapsedSeconds / totalSeconds);
      setDot(currPoint);

      setText(elapsedSeconds >= 10 ? `${elapsedSeconds}` : `0${elapsedSeconds}`);

      if (count >= totalSeconds - 1) {
        clearInterval(interval); // Stop the timer after 119 seconds
      }
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="loader-container">
      <p>It usually takes 2 mins to complete the transaction</p>
      <div className="container">
        <div className="text">{text}</div>
        <div
          style={{ transform: `rotate(${dot}deg)` }}
          className="dot"
        ></div>
        <svg>
          <circle cx="70" cy="70" r="70" />
          <circle
            strokeDashoffset={loadingPercent}
            cx="70"
            cy="70"
            r="70"
          />
        </svg>
      </div>
      <div className="status-container">
        <p>Current Status</p>
        <div className="status-progress">
          <div className="status">
            <span
              style={
                status === "RUNNING"
                  ? { backgroundColor: "blue" }
                  : {}
              }
              id="status-point"
            />
            <p
              style={
                status === "RUNNING"
                  ? { color: "blue" }
                  : {}
              }
            >
              RUNNING
            </p>
          </div>
          <div className="status">
            <span
              style={
                status === "PUBLISHED"
                  ? { backgroundColor: "#006666" }
                  : {}
              }
              id="status-point"
            />
            <p
              style={
                status === "PUBLISHED"
                  ? { color: "#006666" }
                  : {}
              }
            >
              PUBLISHED
            </p>
          </div>
          <div className="status">
            <span
              style={
                status === "SUCCESS"
                  ? { backgroundColor: "green" }
                  : {}
              }
              id="status-point"
            />
            <p
              style={
                status === "SUCCESS"
                  ? { color: "green" }
                  : {}
              }
            >
              SUCCESS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularLoader;
