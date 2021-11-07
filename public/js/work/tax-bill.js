// table total calculate
sumTotal();
function sumTotal() {
  const resultTable = document.getElementById("result-table");
  const totalRow = resultTable.rows[2];

  let agencySum = 0,
    mediaSum = 0,
    dplanSum = 0,
    interSum = 0;

  for (let i = 3; i < resultTable.rows.length; i++) {
    // Total 계산
    agencySum += +resultTable.rows[i].cells[8].innerHTML;
    mediaSum += +resultTable.rows[i].cells[9].innerHTML;
    dplanSum += +resultTable.rows[i].cells[10].innerHTML;
    interSum += +resultTable.rows[i].cells[11].innerHTML;
    resultTable.rows[i].cells[7].innerHTML = nf(
      +resultTable.rows[i].cells[7].innerHTML
    );
    resultTable.rows[i].cells[8].innerHTML = nf(
      +resultTable.rows[i].cells[8].innerHTML
    );
    resultTable.rows[i].cells[9].innerHTML = nf(
      +resultTable.rows[i].cells[9].innerHTML
    );
    resultTable.rows[i].cells[10].innerHTML = nf(
      +resultTable.rows[i].cells[10].innerHTML
    );
    resultTable.rows[i].cells[11].innerHTML = nf(
      +resultTable.rows[i].cells[11].innerHTML
    );
  }
  const totalSum = agencySum + mediaSum + dplanSum + interSum;
  totalRow.cells[7].innerHTML = nf(totalSum);
  totalRow.cells[8].innerHTML = nf(agencySum);
  totalRow.cells[9].innerHTML = nf(mediaSum);
  totalRow.cells[10].innerHTML = nf(dplanSum);
  totalRow.cells[11].innerHTML = nf(interSum);
  totalRow.cells[12].innerHTML =
    (totalSum === 0 ? 0 : (agencySum / totalSum) * 100).toFixed(2) + "%";
  totalRow.cells[13].innerHTML =
    (totalSum === 0 ? 0 : (mediaSum / totalSum) * 100).toFixed(2) + "%";
  totalRow.cells[14].innerHTML =
    (totalSum === 0 ? 0 : (dplanSum / totalSum) * 100).toFixed(2) + "%";
  totalRow.cells[15].innerHTML =
    (totalSum === 0 ? 0 : (interSum / totalSum) * 100).toFixed(2) + "%";
}

/////////////////////////////////////////////////////////////////////////

const sort = document.getElementById("sort");

sort.addEventListener("change", () => {
  const submitInput = document.getElementById("submit-button");
  submitInput.click();
});

// 전체선택
const checkAll = document.getElementById("check-all");

checkAll.addEventListener("click", (e) => {
  const checkBoxes = document.querySelectorAll('input[type="checkbox"]');

  if (e.target.checked) {
    checkBoxes.forEach((checkBox) => {
      checkBox.setAttribute("checked", true);
    });
  } else {
    checkBoxes.forEach((checkBox) => {
      checkBox.removeAttribute("checked");
    });
  }
});

// 마감처리
const closeButton = document.getElementById("close");
if (closeButton) {
  closeButton.addEventListener("click", () => {
    const closeSubmit = document.getElementById("closed-button");
    closeSubmit.click();
  });
}
