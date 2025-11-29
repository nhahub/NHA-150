import { useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  // Controls the index of the image shown in the full-screen slider (null means closed)
  const [imageIndex, setImageIndex] = useState(null);

  // Check if there's more than 4 images to decide how to show the small thumbnails
  const hasMoreThanFour = images.length > 4;

  // Only show up to 3 small images (because the first one is the big featured image)
  const visibleSmallImages = hasMoreThanFour ? images.slice(1, 4) : images.slice(1);

  // Number of images not shown in the small thumbnails (used for the "+X more" overlay)
  const remainingCount = images.length - 4;

  // Handle switching slides inside the full-screen viewer
  const changeSlide = (direction) => {
    if (direction === "left") {
      // If on the first image, wrap around to the last
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      // If on the last image, wrap back to the first
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  return (
    <div className="slider">
      {/* Full-screen slider when an image is selected */}
      {imageIndex !== null && (
        <div className="fullSlider">
          {/* Left arrow for previous image */}
          <div className="arrow" onClick={() => changeSlide("left")}>
            <img src="/arrow.png" alt="" />
          </div>

          {/* Main full-screen image */}
          <div className="imgContainer">
            <img src={images[imageIndex]} alt="" />
          </div>

          {/* Right arrow for next image */}
          <div className="arrow" onClick={() => changeSlide("right")}>
            <img src="/arrow.png" className="right" alt="" />
          </div>

          {/* Close button to exit full-screen mode */}
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}

      {/* The main big featured image */}
      <div className="bigImage">
        <img src={images[0]} alt="" onClick={() => setImageIndex(0)} />
      </div>

      {/* Display the smaller thumbnail images */}
      <div className="smallImages">
        {visibleSmallImages.map((image, index) => (
          <div key={index} className="smallImageWrapper">
            <img
              src={image}
              alt=""
              onClick={() => setImageIndex(index + 1)}
            />

            {/* If there are more than 4 images, show a "+X more" overlay on the last thumbnail */}
            {hasMoreThanFour && index === visibleSmallImages.length - 1 && (
              <div 
                className="moreImagesOverlay"
                onClick={() => setImageIndex(4)}
              >
                <span>+{remainingCount} more</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
