document.addEventListener("DOMContentLoaded", () => {
    let storiesSlider = new Splide("#storiesCards", {
        type: "loop",
        fixedWidth: "262px",
        height: "22.5rem",
        gap: "1.5rem",
        wheel: true,
        wheelSleep: 100,
        waitForTransition: true,
        wheelMinThreshold: 30,
        autoplay: true,
        interval: 4000,
        // flickMaxPages: 1,
        // flickPower: 5,
        arrows: false,
        // fixedHeight: 500,
    })
    storiesSlider.mount()

    let bookItemGallerySlider = new Splide("#bookItemGallerySlider", {
        type: "loop",
        fixedWidth: "430px",
        height: "21.875rem",
        width: "500px",
        gap: "1rem",
        wheel: true,
        wheelSleep: 100,
        waitForTransition: true,
        wheelMinThreshold: 30,
        autoplay: true,
        interval: 4000,
        arrows: false,
    })
    bookItemGallerySlider.mount()
    // console.log(servicesSlider, storiesSlider)
    // console.log(storiesSlider)
})
