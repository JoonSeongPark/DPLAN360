// agency List
const agencyUl = document.getElementById("agency-ul");
const agencyList = Array.from(agencyUl.children).map((x) => {
  return {
    id: x.children[0].innerHTML,
    name: x.children[1].innerHTML,
  };
});

// agency auto complete
const agencyInput = document.getElementById("agency-input");

new autoComplete({
  selector: agencyInput,
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
    const choices = agencyList.map((x) => {
      return x.name;
    });

    const matches = choices.filter((choice) => {
      return choice.toLowerCase().includes(term);
    });
    suggest(matches);
  },
});

// advertiser List
const advertiserUl = document.getElementById("advertiser-ul");
const advertiserList = Array.from(advertiserUl.children).map((x) => {
  return {
    id: x.children[0].innerHTML,
    name: x.children[1].innerHTML,
  };
});

// advertiser auto complete
const advertiserInput = document.getElementById("advertiser-input");

new autoComplete({
  selector: advertiserInput,
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
    const choices = advertiserList.map((x) => {
      return x.name;
    });

    const matches = choices.filter((choice) => {
      return choice.toLowerCase().includes(term);
    });

    suggest(matches);
  },
});

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

const agencyId = document.getElementById("agency-id");
const advertiserId = document.getElementById("advertiser-id");

conditionTable.addEventListener("change", (e) => {
  // 기존 경고문 제거
  conditionTable.nextSibling.remove();

  let targetList, target, targetId;
  switch (e.target.id) {
    case "agency-input":
      targetList = agencyList;
      target = "대행사";
      targetId = agencyId;
      break;
    case "advertiser-input":
      targetList = advertiserList;
      target = "광고주";
      targetId = advertiserId;
      break;
    default:
      submitInput.click();
      break
  }
  if (targetList) {
    const searchedList = targetList.find((x) => x.name === e.target.value);
    if (searchedList === undefined) {
      const errorP = document.createElement("p");
      errorP.classList.add("error-p");
      errorP.innerText = `${target}를 새로 추가하거나 ${target}명을 확인하세요.`;
      conditionTable.parentElement.append(errorP);
      return;
    } else {
      targetId.value = searchedList.id;
    }
  }
  submitInput.click();
});

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
