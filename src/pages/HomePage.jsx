import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import image1 from "../assets/top-rated.jpg";
import image2 from "../assets/get-started.jpg";
import image3 from "../assets/meetings.png";

const HomePage = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <div className="homepage">
        <div className="mainpurp">
          <div className="hero">
            <h1>Study smarter, not harder - Your All-in-One Exam Prep Hub!</h1>
            <p>
              Access <i>notes</i>, watch <i>video lessons</i>, and connect with
              <i> experienced students</i> for live study sessions.
            </p>
            <div className={`buttons ${animate ? "slide-in" : ""}`}>
              <button className="btn" onClick={() => navigate("/Courses")}>
                Explore Courses
              </button>
              <button className="btn" onClick={() => navigate("/Auth")}>
                Login
              </button>
              <button className="btn" onClick={() => navigate("/Meetings")}>
                Join a meeting
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="start">
        <h1>Getting Started?</h1>
        <h3>Log in → Choose Course → Start Learning</h3>
        <div className="cardsrowh">
          <Card
            image={image1}
            title="Top-Rated Courses"
            description="Explore the best courses to ace your exams!"
            link="/courses"
          />
          <Card
            image={image2}
            title="Get Started"
            description="What are you waiting for? Log in and stand out!"
            link="/Auth"
          />
          <Card
            image={image3}
            title="Join Meetings"
            description="Connect with an experienced student!"
            link="/Meetings"
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
