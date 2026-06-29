// Full-screen modal carousel (lightbox) for the gallery.
;(function () {
  const dialog = document.getElementById("lightbox")
  if (!dialog || typeof dialog.showModal !== "function") return

  const slides = Array.from(document.querySelectorAll(".carousel .slide"))
  const img = dialog.querySelector(".lightbox__img")
  const counter = dialog.querySelector(".lightbox__counter")
  const prevBtn = dialog.querySelector(".lightbox__nav--prev")
  const nextBtn = dialog.querySelector(".lightbox__nav--next")
  const closeBtn = dialog.querySelector(".lightbox__close")

  // Source list, drawn from each slide's <img>.
  const sources = slides.map((btn) => {
    const slideImg = btn.querySelector("img")
    return {
      src: slideImg.getAttribute("src"),
      alt: slideImg.getAttribute("alt") || "",
    }
  })

  let current = 0

  function render() {
    const item = sources[current]
    img.setAttribute("src", item.src)
    img.setAttribute("alt", item.alt)
    counter.textContent = `${current + 1} / ${sources.length}`
  }

  function open(index) {
    current = index
    render()
    dialog.showModal()
  }

  function step(delta) {
    current = (current + delta + sources.length) % sources.length
    render()
  }

  slides.forEach((btn, i) => btn.addEventListener("click", () => open(i)))
  prevBtn.addEventListener("click", () => step(-1))
  nextBtn.addEventListener("click", () => step(1))
  closeBtn.addEventListener("click", () => dialog.close())

  // Arrow-key navigation while open.
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      step(1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      step(-1)
    }
    // Esc is handled natively by <dialog>.
  })

  // Click on the backdrop (outside the figure) closes the modal.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close()
  })

  // Swipe navigation on touch devices: drag left → next, right → previous.
  const SWIPE_THRESHOLD = 40 // px of horizontal travel needed to count as a swipe
  let touchStartX = 0
  let touchStartY = 0

  img.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0]
      touchStartX = t.clientX
      touchStartY = t.clientY
    },
    { passive: true }
  )

  img.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStartX
      const dy = t.clientY - touchStartY
      // Only treat as a swipe if it's far enough and more horizontal than vertical
      // (so vertical scrolls/flicks don't trigger navigation).
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        step(dx < 0 ? 1 : -1)
      }
    },
    { passive: true }
  )
})()
