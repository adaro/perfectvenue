import React from "react";
import Slider from "react-slick";

class SimpleSlider extends React.Component {
    state = {
        images: []
    }

    componentWillReceiveProps = (props) => {
      const self = this;
      this.setState({images: props.images }, function(resp) {
        self.slider.slickGoTo(props.selectedElement)
      })
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
                <div key={image.obj.name}>
                    <img src={image.obj.photo} />
                </div>
            )
        })}
      </Slider>
    );
  }
}

export default SimpleSlider;