import React from "react";
// assets
import backButton from "../../assets/images/backButton.svg";
import helpImage from "../../assets/images/helpImage.svg";
//styles
import "./home.scss";
// component
import Spinner from "../spinner/Index";

// utils
import { spinnerDetails } from "../../utils/spinnerUtils";
import { postDataToSheets } from "../../utils/api";

const Home = () => {
  const onRotationComplete = prizeSelected => {
    try {
      postDataToSheets(prizeSelected);
      alert("Data Updated Sucessfully");
    } catch (error) {
      alert("Some error occured");
    }
  };

  return (
    <div>
      <div className="nav-header">
        <div className="back-button">
          <img src={backButton} alt="backButton" />
        </div>
        <div className="heading-text">Your rewards</div>
      </div>
      <div className="spinner-container">
        <Spinner
          spinnerDetails={spinnerDetails}
          onCompleteRotation={onRotationComplete}
        />
      </div>
      <div className="help-section">
        <div className="card-heading">Spin the wheel now to get Rewarded</div>
        <div className="card-subheading">Tap on wheel to rotate the wheel</div>
      </div>
      <div className="help-image">
        <img src={helpImage} alt="helpImage" />
      </div>
    </div>
  );
};

export default Home;
