import "./Card.css";

const Card = ({ image, title, description, link, style }) => {
  return (
    <div className="card" style={style}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      {link && (
        <a href={link} className="button">
          Take me there
        </a>
      )}
    </div>
  );
};

export default Card;
