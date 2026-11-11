(() => {
  const figures = document.querySelectorAll("figure.diagram-expand")
  if (!figures.length) return

  let dialog = document.getElementById("diagram-expand-dialog")
  if (!dialog) {
    dialog = document.createElement("dialog")
    dialog.id = "diagram-expand-dialog"
    dialog.className = "diagram-expand-dialog"
    dialog.innerHTML = `
      <div class="diagram-expand-dialog__bar">
        <span class="diagram-expand-dialog__title"></span>
        <button type="button" class="diagram-expand-dialog__close" aria-label="Close diagram">Close</button>
      </div>
      <div class="diagram-expand-dialog__body">
        <img alt="" />
      </div>
    `
    document.body.appendChild(dialog)
  }

  const titleEl = dialog.querySelector(".diagram-expand-dialog__title")
  const imgEl = dialog.querySelector(".diagram-expand-dialog__body img")
  const closeBtn = dialog.querySelector(".diagram-expand-dialog__close")

  const close = () => {
    if (dialog.open) dialog.close()
  }

  closeBtn.addEventListener("click", close)
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close()
  })
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault()
    close()
  })

  figures.forEach((fig) => {
    const img = fig.querySelector("img")
    if (!img) return

    const open = () => {
      titleEl.textContent = img.alt || "Diagram"
      imgEl.alt = img.alt || ""
      imgEl.src = img.currentSrc || img.src
      if (!dialog.open) dialog.showModal()
    }

    fig.querySelectorAll("[data-diagram-expand]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        open()
      })
    })

    img.style.cursor = "zoom-in"
    img.addEventListener("click", open)
    img.setAttribute("tabindex", "0")
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        open()
      }
    })
  })
})()
