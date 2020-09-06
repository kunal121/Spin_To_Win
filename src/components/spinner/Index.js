import React from "react";
import PropTypes from "prop-types";
import "./spinner.scss";

class Spinner extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      spinAngleStart: 10,
      startAngle: 0,
      spinTime: 0,
      arc: Math.PI / (props.numberOfSections / 2),
      selectedPrize: "",
      selectedIndex: ""
    };
    this.spinTimer = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedPrize !== this.state.selectedPrize) {
      this.props.onCompleteRotation(
        `${this.state.selectedPrize}_${this.state.selectedIndex}`
      );
    }
  }

  componentDidMount() {
    this.drawWheel();
  }
  /* Code Reference Taken From here:- https://codepen.io/kunal121/pen/yLOpMPg?editors=1111 */
  drawWheel = () => {
    const { spinnerDetails } = this.props;
    let { startAngle, arc } = this.state;
    let ctx;
    const canvas = this.refs.canvas;
    if (canvas.getContext) {
      ctx = canvas.getContext("2d");
      const outsideRadius = 100;
      const textRadius = 60;
      const insideRadius = 30;
      const {
        typeOfColors,
        numberOfSections,
        textForSections
      } = spinnerDetails;
      ctx.clearRect(0, 0, 500, 500);

      ctx.font = "bold 12px Helvetica, Arial";

      for (var i = 0; i < numberOfSections; i++) {
        var angle = startAngle + i * arc;
        ctx.fillStyle = typeOfColors[i];
        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgb(220,220,220)";
        ctx.fillStyle = "black";
        ctx.translate(
          250 + Math.cos(angle + arc / 2) * textRadius,
          250 + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2 + 80);
        var text = textForSections[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }

      //Arrow
      ctx.fillStyle = "#FFDDA1";
      ctx.beginPath();
      ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.fill();
      ctx.fillText("SPIN", 250 - ctx.measureText("SPIN").width / 2, 250 + 10);
    }
  };

  spin = () => {
    this.spinTimer = null;
    this.setState({ spinTime: 0 }, () => this.rotate());
  };

  rotate = () => {
    const { spinAngleStart, spinTimeTotal } = this.props;
    if (this.state.spinTime > 2800) {
      clearTimeout(this.spinTimer);
      this.stopRotateWheel();
    } else {
      const spinAngle =
        spinAngleStart -
        this.easeOut(this.state.spinTime, 0, spinAngleStart, spinTimeTotal);
      this.setState(
        {
          startAngle: this.state.startAngle + (spinAngle * Math.PI) / 180,
          spinTime: this.state.spinTime + 30
        },
        () => {
          this.drawWheel();
          clearTimeout(this.spinTimer);
          this.spinTimer = setTimeout(() => this.rotate(), 30);
        }
      );
    }
  };

  stopRotateWheel = () => {
    let { startAngle, arc } = this.state;

    const { spinnerDetails } = this.props;
    const { textForSections } = spinnerDetails;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcInDiameter = (arc * 180) / Math.PI;
    const prizeIndex = Math.floor((360 - (degrees % 360)) / arcInDiameter);
    ctx.save();
    ctx.font = "bold 20px Helvetica, Arial";
    const text = textForSections[prizeIndex];
    ctx.restore();
    this.setState({
      selectedPrize: text,
      selectedIndex: prizeIndex
    });
  };

  /* Code Reference Taken From here:- https://codepen.io/kunal121/pen/yLOpMPg?editors=1111 */
  easeOut = (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  handleOnClick = () => {
    this.spin();
  };

  render = () => {
    return (
      <canvas
        ref="canvas"
        id="canvas-container"
        width="400"
        height="400"
        onClick={this.handleOnClick}
      />
    );
  };
}

Spinner.propTypes = {
  spinAngleStart: PropTypes.number,
  spinTimeTotal: PropTypes.number,
  onCompleteRotation: PropTypes.func
};

Spinner.defaultProps = {
  numberOfSections: 8,
  startAngle: 0,
  spinAngleStart: Math.random() * 10 + 10,
  spinTimeTotal: Math.random() * 3 + 4 * 1000,
  typeOfColors: [
    "#832A4B",
    "#65203A",
    "#832A4B",
    "#65203A",
    "#832A4B",
    "#65203A",
    "#832A4B",
    "#65203A"
  ],
  spinButtonColor: "#FFDDA1",
  textForSections: ["50", "20", "100", "150", "2x", "500", "1.5x", "nothing"]
};

export default Spinner;
