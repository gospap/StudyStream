import "./Courses.css";
import Card from "../components/Card";
import image1 from "../assets/top-rated.jpg";

const coursesData = [
  {
    id: 1,
    image: "image2.jpg",
    title: "React Basics",
    description: "Learn the fundamentals of React.",
    link: "https://reactjs.org/",
  },
  {
    id: 2,
    image: "image2.jpg",
    title: "Advanced JavaScript",
    description: "Deep dive into JS concepts.",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    id: 3,
    image: "image3.jpg",
    title: "CSS Flexbox & Grid",
    description: "Master modern CSS layout techniques.",
    link: "https://css-tricks.com/snippets/css/complete-guide-grid/",
  },
];

function Courses() {
  return (
    <div className="main">
      <h2>Explore notes and Video lectures of the course you want!</h2>

      <div className="courses-main">
        <div className="filter-box">
          <h1>Filters</h1>
        </div>
        <div className="courses-container">
          {coursesData.map((course, index) => {
            <Card
              key={course.id} // πρεπει να ειναι ξεχωριστο σαν πρωτευων κλειδι
              image={course.image}
              title={course.title}
              description={course.description}
              link={course.link}
            />;
          })}
        </div>
      </div>
    </div>
  );
}
export default Courses;
