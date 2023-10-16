const heroSection = document.getElementById("hero-section");

// const imageUrls = [
//   "https://source.unsplash.com/1366x720/?nature",
//   "https://source.unsplash.com/1366x720/?architecture",
//   "https://source.unsplash.com/1366x720/?travel",
//   "https://source.unsplash.com/1366x720/?technology",
//   "https://source.unsplash.com/1366x720/?food",
// ];

const imageUrls = [
  "/src/assets/images/c1.jpg",
  "/src/assets/images/c2.jpg",
  "/src/assets/images/c3.jpg",
  "/src/assets/images/c4.jpg",
  "/src/assets/images/c5.jpg",
  // "https://source.unsplash.com/1366x720/?architecture",
  // "https://source.unsplash.com/1366x720/?travel",
  // "https://source.unsplash.com/1366x720/?technology",
  // "https://source.unsplash.com/1366x720/?food",
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
