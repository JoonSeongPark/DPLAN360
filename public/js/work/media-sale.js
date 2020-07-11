// table total calculate
sumTotal();
function sumTotal() {
  const resultTable = document.getElementById("result-table");
  const totalRow = resultTable.rows[2];

  const adTotalCell = totalRow.cells[7];
  const agencyTotalCell = totalRow.cells[8];
  const mediaTotalCell = totalRow.cells[9];
  const dplanTotalCell = totalRow.cells[10];
  const interTotalCell = totalRow.cells[11];

  let agencySum = 0,
    mediaSum = 0,
    dplanSum = 0,
    interSum = 0;

  for (let i = 3; i < resultTable.rows.length; i++) {
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

  adTotalCell.innerHTML = nf(agencySum + mediaSum + dplanSum + interSum);
  agencyTotalCell.innerHTML = nf(agencySum);
  mediaTotalCell.innerHTML = nf(mediaSum);
  dplanTotalCell.innerHTML = nf(dplanSum);
  interTotalCell.innerHTML = nf(interSum);
}

const conditionTable = document.getElementById("condition-table");
const formEl = document.querySelector("form");
const submitInput = document.getElementById("submit-button");

conditionTable.addEventListener("change", () => submitInput.click());
