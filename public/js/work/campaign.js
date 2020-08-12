// media total calculate
totalCalculate();
function totalCalculate() {
  const agencyFeeRateSum = document.getElementById("agency-fee-rate-sum");
  const mediaFeeRateSum = document.getElementById("media-fee-rate-sum");
  const dplanFeeRateSum = document.getElementById("dplan-fee-rate-sum");
  const interFeeRateSum = document.getElementById("inter-fee-rate-sum");
  const adFeeSum = document.getElementById("ad-fee-sum");
  const agencyFeeSum = document.getElementById("agency-fee-sum");
  const mediaFeeSum = document.getElementById("media-fee-sum");
  const dplanFeeSum = document.getElementById("dplan-fee-sum");
  const interFeeSum = document.getElementById("inter-fee-sum");

  const mediaTable = document.getElementById("media-table");

  let adSum = 0,
    agencySum = 0,
    mediaSum = 0,
    dplanSum = 0,
    interSum = 0;

  for (let i = 2; i < mediaTable.rows.length - 1; i++) {
    adSum += +mediaTable.rows[i].cells[11].innerHTML;
    agencySum += +mediaTable.rows[i].cells[12].innerHTML;
    mediaSum += +mediaTable.rows[i].cells[13].innerHTML;
    dplanSum += +mediaTable.rows[i].cells[14].innerHTML;
    interSum += +mediaTable.rows[i].cells[15].innerHTML;
    mediaTable.rows[i].cells[11].innerHTML = nf(
      +mediaTable.rows[i].cells[11].innerHTML
    );
    mediaTable.rows[i].cells[12].innerHTML = nf(
      +mediaTable.rows[i].cells[12].innerHTML
    );
    mediaTable.rows[i].cells[13].innerHTML = nf(
      +mediaTable.rows[i].cells[13].innerHTML
    );
    mediaTable.rows[i].cells[14].innerHTML = nf(
      +mediaTable.rows[i].cells[14].innerHTML
    );
    mediaTable.rows[i].cells[15].innerHTML = nf(
      +mediaTable.rows[i].cells[15].innerHTML
    );
  }

  adFeeSum.innerHTML = nf(adSum);
  agencyFeeSum.innerHTML = nf(agencySum);
  mediaFeeSum.innerHTML = nf(mediaSum);
  dplanFeeSum.innerHTML = nf(dplanSum);
  interFeeSum.innerHTML = nf(interSum);

  agencyFeeRateSum.innerHTML = ((agencySum / adSum) * 100).toFixed(2);
  mediaFeeRateSum.innerHTML = ((mediaSum / adSum) * 100).toFixed(2);
  dplanFeeRateSum.innerHTML = ((dplanSum / adSum) * 100).toFixed(2);
  interFeeRateSum.innerHTML = ((interSum / adSum) * 100).toFixed(2);
}

const deleteBtn = document.getElementById("delete-button");

function alertModal(e) {

  const formEl = e.target.closest("form");

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  const modal = document.createElement("div");
  modal.classList.add("modal", "alert-modal");
  modal.innerHTML = "<h1>삭제하겠습니까?</h1>";

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

deleteBtn.addEventListener("click", alertModal);
