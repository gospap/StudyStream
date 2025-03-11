import { Link, useNavigate } from "react-router-dom";

function Meetings() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Meetings Page</h1>
      <p>Manage your meetings here.</p>
    </div>
  );
}

export default Meetings;
