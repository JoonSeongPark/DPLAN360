// DB List

// main category list
const mainUl = document.getElementById("main-ul");
const mainList = Array.from(mainUl.children).map((x) => {
  return { id: x.children[0].innerHTML, name: x.children[1].innerHTML };
});

// sub category list
const subUl = document.getElementById("sub-ul");
const subList = Array.from(subUl.children).map((x) => {
  return {
    id: x.children[0].innerHTML,
    name: x.children[1].innerHTML,
    mainId: x.children[2].innerHTML,
  };
});

// advertiser List
const advertiserUl = document.getElementById("advertiser-ul");
const adList = Array.from(advertiserUl.children).map((x) => {
  return {
    id: x.children[0].innerHTML,
    name: x.children[1].innerHTML,
    sub_id: x.children[2].innerHTML,
  };
});

// agency List
const agencyUl = document.getElementById("agency-ul");
const agencyList = Array.from(agencyUl.children).map((x) => {
  return {
    id: x.children[0].innerHTML,
    name: x.children[1].innerHTML,
    pay_condition: x.children[2].innerHTML,
    deposit_type: x.children[3].innerHTML,
    bill_type: x.children[4].innerHTML,
  };
});

// media List
const mediaUl = document.getElementById("media-ul");
const mediaList = Array.from(mediaUl.children).map((x) => {
  return {
    id: x.children[0].innerHTML,
    name: x.children[1].innerHTML,
    pay_condition: x.children[2].innerHTML,
    bill_type: x.children[3].innerHTML,
    provide_fee_rate: x.children[4].innerHTML,
    inter_type: x.children[5].innerHTML,
    inter_name: x.children[6].innerHTML,
    agency_fee_rate: x.children[7].innerHTML,
    media_fee_rate: x.children[8].innerHTML,
    dplan_fee_rate: x.children[9].innerHTML,
    inter_fee_rate: x.children[10].innerHTML,
  };
});

/////////////////////////////////////////////////////////////////
const mediaCount = document.getElementById("media-count");

const camAdTotal = document.getElementById("cam-ad-total");
const camAgencyFeeRate = document.getElementById("cam-agency-fee-rate");
const camAgencyFee = document.getElementById("cam-agency-fee");
const camMediaFee = document.getElementById("cam-media-fee");
const camDpalnFee = document.getElementById("cam-dplan-fee");
const camInterFee = document.getElementById("cam-inter-fee");

const block = document.getElementById("block").value;
/////////////////////////////////////////////////////////////////

// advertiser auto complete
const advertiserInput = document.getElementById("cam-advertiser");

new autoComplete({
  selector: advertiserInput,
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
    const choices = adList.map((x) => {
      return x.name;
    });

    const matches = choices.filter((choice) => {
      return choice.toLowerCase().includes(term);
    });

    suggest(matches);
  },
});

const mainInput = document.getElementById("cam-main-cat");
const subInput = document.getElementById("cam-sub-cat");

const advertiserInputId = document.getElementById("cam-advertiser-id");
advertiserInput.addEventListener("focusout", (e) => {
  const advertiser_info = adList.find((x) => x.name === e.target.value);
  if (!advertiser_info) return;
  advertiserInputId.value = advertiser_info.id;
  subInput.value = subList.find((x) => +x.id === +advertiser_info.sub_id).name;
  const mainId = subList.find((x) => +x.id === +advertiser_info.sub_id).mainId;
  mainInput.value = mainList.find((x) => +x.id === +mainId).name;
});

/////////////////////////////////////////////////////////////////

// agency auto complete
const agencyInput = document.getElementById("cam-agency");

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

const agencyIdInput = document.getElementById("cam-agency-id");
const agencyPayCondition = document.getElementById("agency-pay-condition");
agencyInput.addEventListener("change", (e) => {
  agencyIdInput.value = agencyList.find(
    (agency) => agency.name === e.target.value
  ).id;
  agencyPayCondition.value = agencyList.find(
    (agency) => agency.name === e.target.value
  ).pay_condition;
});

/////////////////////////////////////////////////////////////////////

// total cell 불러오기
const mediaTable = document.getElementById("media-table");
const lowerAdFeeSum = document.getElementById("lower-ad-fee-sum");
const lowerAgencyFeeSum = document.getElementById("lower-agency-fee-sum");
const lowerMediaFeeSum = document.getElementById("lower-media-fee-sum");
const lowerDplanFeeSum = document.getElementById("lower-dplan-fee-sum");
const lowerInterFeeSum = document.getElementById("lower-inter-fee-sum");

const lowerAgencyFeeRateSum = document.getElementById(
  "lower-agency-fee-rate-sum"
);
const lowerMediaFeeRateSum = document.getElementById(
  "lower-media-fee-rate-sum"
);
const lowerDplanFeeRateSum = document.getElementById(
  "lower-dplan-fee-rate-sum"
);
const lowerInterFeeRateSum = document.getElementById(
  "lower-inter-fee-rate-sum"
);

autoTotalCaculate();
// 각 매체의 합 계산 함수 (autoCalculate에서 호출)
function autoTotalCaculate() {
  let adFeeSum = 0,
    agencyFeeSum = 0,
    mediaFeeSum = 0,
    dplanFeeSum = 0,
    interFeeSum = 0,
    targetRow;
  const len = mediaTable.rows.length;

  for (let i = 2; i < len - 1; i++) {
    targetRow = mediaTable.rows[i];
    adFeeSum += +targetRow.cells[13].children[0].value;
    agencyFeeSum += +targetRow.cells[14].children[0].value;
    mediaFeeSum += +targetRow.cells[15].children[0].value;
    dplanFeeSum += +targetRow.cells[16].children[0].value;
    interFeeSum += +targetRow.cells[17].children[0].value;
  }
  lowerAdFeeSum.innerHTML = nf(adFeeSum);
  lowerAgencyFeeSum.innerHTML = nf(agencyFeeSum);
  lowerMediaFeeSum.innerHTML = nf(mediaFeeSum);
  lowerDplanFeeSum.innerHTML = nf(dplanFeeSum);
  lowerInterFeeSum.innerHTML = nf(interFeeSum);

  // media total
  if (adFeeSum !== 0) {
    lowerAgencyFeeRateSum.innerHTML = agencyFeeSum
      ? ((agencyFeeSum / adFeeSum) * 100).toFixed(2)
      : 0;
    lowerMediaFeeRateSum.innerHTML = mediaFeeSum
      ? ((mediaFeeSum / adFeeSum) * 100).toFixed(2)
      : 0;
    lowerDplanFeeRateSum.innerHTML = dplanFeeSum
      ? ((dplanFeeSum / adFeeSum) * 100).toFixed(2)
      : 0;
    lowerInterFeeRateSum.innerHTML = interFeeSum
      ? ((interFeeSum / adFeeSum) * 100).toFixed(2)
      : 0;
  }

  if (!block) {
    camAdTotal.value = adFeeSum;
    if (adFeeSum != 0)
      camAgencyFeeRate.value = agencyFeeSum
        ? ((agencyFeeSum / adFeeSum) * 100).toFixed(2)
        : 0;
    camAgencyFee.value = agencyFeeSum;
    camMediaFee.value = mediaFeeSum;
    camDpalnFee.value = dplanFeeSum;
    camInterFee.value = interFeeSum;
  }
}
////////////////////////////////////////////////////////////////////////

const submitBtn = document.getElementById("submit-btn");

// event delegation
mediaTable.addEventListener("change", autoCalculate);
mediaTable.addEventListener("change", autoDepositCalculator);
mediaTable.addEventListener("change", (e) => {
  if (e.target.name !== "media_start" && e.target.name !== "media_end") return;

  const targetRow = e.target.closest("tr");

  const beginDate = targetRow.cells[1].children[0].value;
  const endDate = targetRow.cells[2].children[0].value;

  if (beginDate && endDate) {
    const agencyIssueDate = e.target.value.split("-");

    if (!beginDate) return alert("시작일을 입력하세요.");
    if (!endDate) return alert("시작일을 입력하세요.");

    const agencyPayCondition = document.getElementById("agency-pay-condition")
      .value;
    if (!agencyPayCondition) return alert("대행사를 입력하세요");
    targetRow.cells[8].children[0].value = depositCalculator(
      beginDate,
      endDate,
      agencyIssueDate[0],
      agencyIssueDate[1],
      agencyPayCondition
    );
  }
});
mediaTable.addEventListener("change", function () {
  const rows = this.rows;

  for (let i = 2; i < rows.length - 1; i++) {
    if (rows[i].cells[7].childNodes[1].classList.contains("error-border")) {
      return submitBtn.setAttribute("disabled", "disabled");
    }
  }
  submitBtn.removeAttribute("disabled");
});
mediaTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("alert-btn")) {
    mediaCount.value = +mediaCount.value - 1;
    e.target.closest("tr").remove();
    autoTotalCaculate();
  }
});

const startDate = document.getElementById("cam-start-date");
const endDate = document.getElementById("cam-end-date");

const setDate = document.getElementById("set-date");

// 날짜 맞춤 버튼
function autoSetDate() {
  const len = mediaTable.rows.length;

  for (let i = 2; i < len - 1; i++) {
    mediaTable.rows[i].cells[1].children[0].value = startDate.value;
    mediaTable.rows[i].cells[2].children[0].value = endDate.value;
  }
}

setDate.addEventListener("click", autoSetDate);
setDate.addEventListener("click", () => {
  const rows = mediaTable.rows;

  for (let i = 2; i < rows.length - 1; i++) {
    const targetRow = rows[i];

    const beginDate = targetRow.cells[1].children[0].value;
    const endDate = targetRow.cells[2].children[0].value;

    if (beginDate && endDate) {
      console.log(targetRow.cells[7].children[0]);
      const agencyIssueDate = targetRow.cells[7].children[0].value.split("-");

      const agencyPayCondition = document.getElementById("agency-pay-condition")
        .value;

      if (!agencyPayCondition) return alert("대행사를 입력하세요");
      targetRow.cells[8].children[0].value = depositCalculator(
        beginDate,
        endDate,
        agencyIssueDate[0],
        agencyIssueDate[1],
        agencyPayCondition
      );
    }
  }
});
