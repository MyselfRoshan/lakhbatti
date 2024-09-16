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
        arrows: false,
    })
    storiesSlider.mount()

    let bookItemGallerySlider = new Splide("#bookItemGallerySlider", {
        type: "loop",
        fixedWidth: "300px",
        height: "240px",
        width: "300px",
        gap: "1rem",
        wheel: true,
        wheelSleep: 100,
        waitForTransition: true,
        wheelMinThreshold: 30,
        autoplay: true,
        interval: 4000,
        arrows: false,
        mediaQuery: "min",
        breakpoints: {
            890: {
                // height: "21.875rem",
                // fixedWidth: "430px",
                width: "500px",
            },
            768: {
                height: "21.875rem",
                fixedWidth: "430px",
                width: "430px",
            },
        },
    })
    bookItemGallerySlider.mount()

    const bookItemGalleryImgs = document.querySelectorAll(
        "#bookItemGallerySlider .splide__slide",
    )
    const bookItemGalleryImgsCount = document.querySelector(
        "#bookItemGalleryImgsCount",
    )

    // Splide create 4 exxtra images for the slider
    const NO_OF_CLONE_IMGS = 4

    const NO_OF_IMGS = bookItemGalleryImgs.length - NO_OF_CLONE_IMGS
    bookItemGalleryImgsCount.innerText = `(${NO_OF_IMGS} images)`
})
