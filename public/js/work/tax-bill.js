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

  adTotalCell.innerHTML = nf(agencySum + mediaSum + dplanSum + interSum);
  agencyTotalCell.innerHTML = nf(agencySum);
  mediaTotalCell.innerHTML = nf(mediaSum);
  dplanTotalCell.innerHTML = nf(dplanSum);
  interTotalCell.innerHTML = nf(interSum);
}

/////////////////////////////////////////////////////////////////////////

const conditionTable = document.getElementById("condition-table");

conditionTable.addEventListener("change", () => {
  const agencyStartDate = new Date(
    document.getElementById("agency-start-date").value
  );
  const agencyEndDate = new Date(
    document.getElementById("agency-end-date").value
  );
  const mediaStartDate = new Date(
    document.getElementById("media-start-date").value
  );
  const mediaEndDate = new Date(
    document.getElementById("media-end-date").value
  );

  if (agencyStartDate > agencyEndDate || mediaStartDate > mediaEndDate) {
    alert("시작일이 종료일을 넘을 수 없습니다.");
    return;
  }

  const submitInput = document.getElementById("submit-button");
  // 기존 경고문 제거
  conditionTable.nextSibling.remove();

  submitInput.click();
});

/////////////////////////////////////////////////////////////////////////

// excel download

const excelDownloadEl = document.getElementById("excel-download");
const file_name = "세금계산서";

function excelDownload() {
  const resultTable = document.getElementById("result-table");
  const data_type = "data:application/vnd.ms-excel;charset=utf-8";
  const table_html = encodeURIComponent(resultTable.outerHTML);

  const aTag = document.createElement("a");
  aTag.href = `${data_type},%EF%BB%BF${table_html}`;
  aTag.download = `${file_name}.xls`;
  aTag.click();
}

excelDownloadEl.addEventListener("click", excelDownload);
