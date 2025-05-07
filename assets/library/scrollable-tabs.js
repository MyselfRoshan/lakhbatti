/*
USAGE:
<div id="scrollable-tabs">
    <button class="arrow left" aria-label="Scroll tabs left"></button>
    <div class="tabs" role="tablist">
        <button class="tab" role="tab">Tab 1</button>
        <button class="tab" role="tab">Tab 2</button>
        <button class="tab" role="tab">Tab 3</button>
        <button class="tab" role="tab">Tab 4</button>
    </div>
    <button class="arrow right" aria-label="Scroll tabs right"></button>
</div>

initTabs("#tabs-wrapper", {
    onTabClick: tab => {
        console.log("Tab clicked", tab)
    }
})
*/

const SCROLL_DISTANCE = 200;
const SCROLL_THRESHOLD = 5;

export function initTabs(tabsWrapper, options = {}) {
  let tabsWrapperElement =
    typeof tabsWrapper === "string"
      ? document.querySelector(tabsWrapper)
      : tabsWrapper;

  if (!tabsWrapperElement) {
    console.error(`Scrollable Tabs element ${tabsWrapper} not found`);
    return;
  }

  const prev = tabsWrapperElement.querySelector(".arrow-left");
  const next = tabsWrapperElement.querySelector(".arrow-right");
  const tabsList = tabsWrapperElement.querySelector(".tabs");
  const tabs = [...tabsList.querySelectorAll(".tab")];

  const {
    enableSliderUpdate = true,
    onTabClick = () => {},
    onArrowClick = defaultArrowClickHandler,
  } = options;

  // Initialize ARIA attributes
  initAriaAttributes();

  const throttledHandleArrows = throttle(handleArrows, 100);

  // Initialize ResizeObserver
  const resizeObserver = new ResizeObserver(throttledHandleArrows);
  resizeObserver.observe(tabsWrapperElement);

  // Initialize IntersectionObserver
  const intersectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.target === tabs[0]) {
          prev.dataset.active = (!entry.isIntersecting).toString();
        }
        if (entry.target === tabs[tabs.length - 1]) {
          next.dataset.active = (!entry.isIntersecting).toString();
        }
      });
    },
    { root: tabsList },
  );
  intersectionObserver.observe(tabs[0]);
  intersectionObserver.observe(tabs[tabs.length - 1]);

  // Initialize touch variables
  let touchStart = 0;
  let touchX = 0;
  let isTouching = false;

  const initialActiveTab = tabsList.querySelector(".tab-active");
  if (initialActiveTab) {
    onTabClickHandler(initialActiveTab);
    if (enableSliderUpdate) {
      updateSlider(initialActiveTab);
    }
    centerActiveTab(initialActiveTab);
    throttledHandleArrows();
  }

  function onTabClickHandler(activeTab) {
    try {
      const activeTabKey = Number(activeTab.dataset.key);
      if (enableSliderUpdate) {
        updateSlider(activeTab);
      }
      tabs.forEach(t => {
        t.classList.toggle("tab-active", t === activeTab);
        t.setAttribute("aria-selected", t === activeTab);
      });
      centerActiveTab(activeTab);
      throttledHandleArrows();
      onTabClick(activeTab, activeTabKey);
    } catch (error) {
      console.error("Error in tab click handler:", error);
    }
  }

  function defaultArrowClickHandler(direction) {
    try {
      const scrollOffset =
        direction === "left" ? -SCROLL_DISTANCE : SCROLL_DISTANCE;
      tabsList.scrollLeft += scrollOffset;
      throttledHandleArrows();
    } catch (error) {
      console.error("Error in arrow click handler:", error);
    }
  }

  function handleArrows() {
    try {
      const { scrollLeft, scrollWidth, clientWidth } = tabsList;
      const maxScrollWidth = scrollWidth - clientWidth - SCROLL_THRESHOLD;
      prev.dataset.active = (scrollLeft > SCROLL_THRESHOLD).toString();
      next.dataset.active = (scrollLeft < maxScrollWidth).toString();
    } catch (error) {
      console.error("Error handling arrows:", error);
    }
  }

  function handleWheel(e) {
    try {
      if (e.deltaY === 0) return;
      e.preventDefault();
      tabsList.scrollLeft += e.deltaY;
      throttledHandleArrows();
    } catch (error) {
      console.error("Error handling wheel:", error);
    }
  }

  function handleTouchStart(e) {
    touchStart = e.touches[0].clientX;
    touchX = touchStart;
    isTouching = true;
  }

  function handleTouchMove(e) {
    if (!isTouching) return;
    e.preventDefault();
    const currentX = e.touches[0].clientX;
    const diff = touchX - currentX;
    tabsList.scrollLeft += diff;
    touchX = currentX;
    throttledHandleArrows();
  }

  function handleTouchEnd() {
    isTouching = false;
  }

  function handleKeydown(e) {
    try {
      const activeTab = tabsList.querySelector(".tab-active");
      if (!activeTab) return;

      switch (e.key) {
        case "ArrowRight":
          const nextTab = activeTab.nextElementSibling;
          if (nextTab && nextTab.classList.contains("tab")) {
            onTabClickHandler(nextTab);
          }
          break;
        case "ArrowLeft":
          const prevTab = activeTab.previousElementSibling;
          if (prevTab && prevTab.classList.contains("tab")) {
            onTabClickHandler(prevTab);
          }
          break;
      }
    } catch (error) {
      console.error("Error handling keydown:", error);
    }
  }

  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  function updateSlider(tab) {
    try {
      const { offsetWidth, offsetLeft } = tab;
      tabsList.style.setProperty("--_slide-width", `${offsetWidth}px`);
      tabsList.style.setProperty("--_slide-left", `${offsetLeft}px`);
    } catch (error) {
      console.error("Error updating slider:", error);
    }
  }

  function centerActiveTab(tab) {
    try {
      const tabRect = tab.getBoundingClientRect();
      const containerRect = tabsList.getBoundingClientRect();
      const scrollLeft = tabsList.scrollLeft;
      const centerPosition =
        scrollLeft +
        tabRect.left -
        containerRect.left +
        tabRect.width / 2 -
        containerRect.width / 2;

      tabsList.scrollTo({
        left: centerPosition,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error centering active tab:", error);
    }
  }

  function initAriaAttributes() {
    try {
      tabsList.setAttribute("role", "tablist");
      tabs.forEach(tab => {
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", tab.classList.contains("tab-active"));
        tab.setAttribute("tabindex", "0");
      });
      prev.setAttribute("aria-label", "Scroll tabs left");
      next.setAttribute("aria-label", "Scroll tabs right");
    } catch (error) {
      console.error("Error initializing ARIA attributes:", error);
    }
  }

  // Event Listeners
  tabsList.addEventListener("scroll", throttledHandleArrows, { passive: true });
  tabsList.addEventListener("wheel", handleWheel, { passive: false });

  // Touch Events
  tabsList.addEventListener("touchstart", handleTouchStart, { passive: true });
  tabsList.addEventListener("touchmove", handleTouchMove, { passive: false });
  tabsList.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Keyboard Navigation
  tabsWrapperElement.addEventListener("keydown", handleKeydown);

  tabs.forEach(tab =>
    tab.addEventListener("click", () => onTabClickHandler(tab)),
  );
  prev.addEventListener("click", () => onArrowClick("left"));
  next.addEventListener("click", () => onArrowClick("right"));

  // Return cleanup function and handlers
  return {
    destroy: () => {
      // Remove event listeners
      tabsList.removeEventListener("scroll", throttledHandleArrows);
      tabsList.removeEventListener("wheel", handleWheel);
      tabsList.removeEventListener("touchstart", handleTouchStart);
      tabsList.removeEventListener("touchmove", handleTouchMove);
      tabsList.removeEventListener("touchend", handleTouchEnd);
      tabsWrapperElement.removeEventListener("keydown", handleKeydown);

      tabs.forEach(tab =>
        tab.removeEventListener("click", () => onTabClickHandler(tab)),
      );
      prev.removeEventListener("click", () => onArrowClick("left"));
      next.removeEventListener("click", () => onArrowClick("right"));

      // Disconnect observers
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    },
  };
}

export function attachTabActivationButton(
  activationBtn,
  tabsWrapper,
  targetTabKey,
) {
  const tabsWrapperElement =
    typeof tabsWrapper === "string"
      ? document.querySelector(tabsWrapper)
      : tabsWrapper;

  const activationBtnElement =
    typeof activationBtn === "string"
      ? document.querySelector(activationBtn)
      : activationBtn;

  if (!tabsWrapperElement) {
    console.error(`Tabs wrapper with ID ${tabsWrapperElement} not found.`);
    return;
  }

  const tabsList = tabsWrapperElement.querySelector(".tabs");
  const targetTab = Array.from(tabsList.querySelectorAll(".tab")).find(
    tab => tab.dataset.key == targetTabKey,
  );

  if (activationBtnElement && targetTab) {
    activationBtnElement.addEventListener("click", function () {
      targetTab.click();
      targetTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    });
  } else {
    console.error(
      `Activation button with ID ${activationBtn} or target tab with data-key ${targetTabKey} not found. Check your element IDs and data-key attributes.`,
    );
  }
}
