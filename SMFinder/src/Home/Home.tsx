import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const Navigate = useNavigate();

  const handleGetStarted = () => {
    Navigate("/comparison");
  };

  return (
    <div className="maindiv bg-dark w-100 vh-100 ">
      <div className="row col-12">
        <div className="col-12 d-flex">
          <p className="headingg">SimiliFy</p>
        </div>
      </div>
      <div className="centercontent ms-auto me-auto col-8 h-auto p-4">
        <div className="row col-12">
          <div className="col-12 d-flex justify-content-center align-items-center p-0">
            <p className="heading1">Welocome to SimiliFy... </p>
          </div>
        </div>

        <div className="row col-12">
          <div className="col-12  d-flex justify-content-center align-items-center">
            <p className="heading2">
              Upload a large image set and a reference image, quickly discover
              similar images with ease.
            </p>
          </div>
        </div>

        <div
          className="btn button col-2 d-flex justify-content-center align-items-center m-auto"
          onClick={handleGetStarted}
        >
          <p>Get Started</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
