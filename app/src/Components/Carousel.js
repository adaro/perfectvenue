import React from "react";
import Slider from "react-slick";

class SimpleSlider extends React.Component {
    state = {
        images: []
    }

    componentWillReceiveProps = (props) => {
      console.log(props.selectedElement)
      this.slider.slickGoTo(props.selectedElement)
      this.setState({images: props.images })
    }


  render() {
    var settings = {
      dots: false,
      className: "",
      // infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <Slider {...settings}  ref={slider => (this.slider = slider)}>
        {this.state.images.map(function(image) {
            return (
                <div key={image.ledgend}>
                    <img src={image.image_src} />
                    <p className="legend">{image.ledgend}</p>
                </div>
            )
        })}
      </Slider>
    );
  }
}

export default SimpleSlider;