// ===*Amazon Carousal*===
import React, { useState, useEffect } from 'react';

// ===*Carousel Css*===
import "./Carousel.css"



// ===*Slides Data *===

    const slides = [
      {
        id: 1,
        image: "/src/assets/images/Hero1.png",
        title: "Latest Electronics",
        description: "Discover the newest gadgets and tech innovations with exclusive deals.",
        buttonText: "Shop Now"
      },
      {
        id: 2,
        image: "/src/assets/images/Hero2.png",
        title: "Summer Fashion",
        description: "Refresh your wardrobe with our latest summer collection.",
        buttonText: "Shop Now"
      },
      {
        id: 3,
        image: "/src/assets/images/Hero3.png",
        title: "Home & Kitchen",
        description: "Upgrade your home with our premium kitchen appliances.",
        buttonText: "Shop Now"
      },
      {
        id: 4,
        image: "/src/assets/images/Hero4.png",
        title: "Fitness Equipment",
        description: "Get fit at home with our range of exercise equipment.",
        buttonText: "Shop Now"
      },
      {
        id: 5,
        image: "/src/assets/images/Hero5.jpg",
        title: "Best Sellers",
        description: "Explore our collection of best-selling books across all genres.",
        buttonText: "Shop Now"
      }
    ];




const AmazonCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="amazon-carousel-container">
      <div className="amazon-carousel">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="carousel-slide">
              <img src={slide.image} alt={slide.title} />
              <div className="carousel-caption">
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <button className="btn-shop-now">{slide.buttonText}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button 
          className="carousel-control prev" 
          onClick={goToPrevSlide}
          aria-label="Previous slide"
        >
          <span className="control-icon">‹</span>
        </button>
        <button 
          className="carousel-control next" 
          onClick={goToNextSlide}
          aria-label="Next slide"
        >
          <span className="control-icon">›</span>
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmazonCarousel;
