const heroSection = document.getElementById("hero-section");

const imageUrls = [
  "/src/assets/images/c1.jpg",
  "/src/assets/images/c2.jpg",
  "/src/assets/images/c3.jpg",
  "/src/assets/images/c4.jpg",
];

let currentImageIndex = 0;

function changeBackgroundImage() {
  heroSection.style.backgroundImage = `url(${imageUrls[currentImageIndex]})`;
  currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
}

// Initial call to set the first background image
changeBackgroundImage();

// Set an interval to change the background image every 5 seconds (5000 milliseconds)
setInterval(changeBackgroundImage, 5000);
