// table total calculate
sumTotal();
function sumTotal() {
  const resultTable = document.getElementById("result-table");
  const totalRow = resultTable.rows[2];

  const adTotalCell = totalRow.cells[6];
  const agencyTotalCell = totalRow.cells[7];
  const mediaTotalCell = totalRow.cells[8];
  const dplanTotalCell = totalRow.cells[9];
  const interTotalCell = totalRow.cells[10];

  let agencySum = 0,
    mediaSum = 0,
    dplanSum = 0,
    interSum = 0;

  for (let i = 3; i < resultTable.rows.length; i++) {
    agencySum += +resultTable.rows[i].cells[7].innerHTML;
    mediaSum += +resultTable.rows[i].cells[8].innerHTML;
    dplanSum += +resultTable.rows[i].cells[9].innerHTML;
    interSum += +resultTable.rows[i].cells[10].innerHTML;
    resultTable.rows[i].cells[6].innerHTML = nf(
      +resultTable.rows[i].cells[6].innerHTML
    );
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
  }

  adTotalCell.innerHTML = nf(agencySum + mediaSum + dplanSum + interSum);
  agencyTotalCell.innerHTML = nf(agencySum);
  mediaTotalCell.innerHTML = nf(mediaSum);
  dplanTotalCell.innerHTML = nf(dplanSum);
  interTotalCell.innerHTML = nf(interSum);
}

const conditionTable = document.getElementById("condition-table");
const submitInput = document.getElementById("submit-button");

conditionTable.addEventListener("change", () => submitInput.click());

/////////////////////////////////////////////////////////////////////////

// excel download

const excelDownloadEl = document.getElementById("excel-download");
const file_name = "sample";

function excelDownload() {
  const resultTable = document.getElementById("result-table");
  // resultTable.style.border = "thin solid gray"
  const data_type = "data:application/vnd.ms-excel;charset=utf-8";
  const table_html = encodeURIComponent(resultTable.outerHTML);

  const aTag = document.createElement("a");
  aTag.href = `${data_type},%EF%BB%BF${table_html}`;
  aTag.download = `${file_name}.xls`;
  aTag.click();
}

excelDownloadEl.addEventListener("click", excelDownload);
