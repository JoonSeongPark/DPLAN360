const tableEls = document.querySelectorAll("table");

function alertModal(e) {
  if (!e.target.classList.contains("alert-btn")) return;

  const formEl = e.target.closest("form");

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = "<h2>삭제하겠습니까?</h2>";

  const btns = document.createElement("div");
  btns.classList.add("btns");
  btns.innerHTML = `
  <button class="btn alert-btn" type="submit">삭제</button>
  <button class="btn cancel-btn" type="button" id="cancel-btn">취소</button>
  `;
  modal.appendChild(btns);
  modalContainer.appendChild(modal);

  formEl.appendChild(modalContainer);

  const cancelBtn = document.getElementById("cancel-btn");
  cancelBtn.addEventListener("click", () => {
    modalContainer.remove();
  });
}

tableEls.forEach((el) => {
  el.addEventListener("click", alertModal);
});
