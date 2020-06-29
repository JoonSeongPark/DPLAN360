// DB List

// main category list
const mainUl = document.getElementById("main-ul");
const mainList = Array.from(mainUl.children).map((x) => {
  return { id: x.children[0].innerHTML, name: x.children[1].innerHTML };
});

// sub category list
const subUl = document.getElementById("sub-ul");
const subList = Array.from(subUl.children).map((x) => {
  return { id: x.children[0].innerHTML, name: x.children[1].innerHTML };
});

// advertiser List
const advertiserUl = document.getElementById("advertiser-ul");
const adList = Array.from(advertiserUl.children).map((x) => {
  return {
    name: x.children[0].innerHTML,
    main_id: x.children[1].innerHTML,
    sub_id: x.children[2].innerHTML,
  };
});

// agency List
const agencyUl = document.getElementById("agency-ul");
const agencyList = Array.from(agencyUl.children).map((x) => {
  return {
    name: x.children[0].innerHTML,
    pay_condition: x.children[1].innerHTML,
    deposit_type: x.children[2].innerHTML,
    bill_type: x.children[3].innerHTML,
  };
});

// media List
const mediaUl = document.getElementById("media-ul");
const mediaList = Array.from(mediaUl.children).map((x) => {
  return {
    name: x.children[0].innerHTML,
    pay_condition: x.children[1].innerHTML,
    bill_type: x.children[2].innerHTML,
    provide_fee_rate: x.children[3].innerHTML,
    inter_type: x.children[4].innerHTML,
    inter_name: x.children[5].innerHTML,
    agency_fee_rate: x.children[6].innerHTML,
    media_fee_rate: x.children[7].innerHTML,
    dplan_fee_rate: x.children[8].innerHTML,
    inter_fee_rate: x.children[9].innerHTML,
  };
});

/////////////////////////////////////////////////////////////////

// today date auto input
inputToday();
function inputToday() {
  const camDate = document.getElementById("cam-date");
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth();
  month = month < 10 ? `0${month}` : month;
  const day = today.getDate();

  camDate.value = `${year}-${month}-${day}`;
}

/////////////////////////////////////////////////////////////////
const mediaCount = document.getElementById("media-count");
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

advertiserInput.addEventListener("focusout", (e) => {
  const advertiser_info = adList.find((x) => x.name === e.target.value);
  if (!advertiser_info) return;
  mainInput.value = mainList.find((x) => x.id == advertiser_info.main_id).name;
  subInput.value = subList.find((x) => x.id == advertiser_info.sub_id).name;
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

////////////////////////////////////////////////////////////////////

// 각 매체 자동 계산 함수
function autoCalculate(e) {
  // 숫자 부분만 함수적용
  if (!e.target.classList.contains("input-num")) return;

  const targetRow = e.target.closest("tr");
  const agencyFeeRateInput = targetRow.cells[6].children[0];
  const mediaFeeRateInput = targetRow.cells[7].children[0];
  const dplanFeeRateInput = targetRow.cells[8].children[0];
  const interFeeRateInput = targetRow.cells[9].children[0];
  const totalFeeInput = targetRow.cells[10].children[0];
  const agencyFeeInput = targetRow.cells[11].children[0];
  const mediaFeeInput = targetRow.cells[12].children[0];
  const dplanFeeInput = targetRow.cells[13].children[0];
  const interFeeInput = targetRow.cells[14].children[0];

  // input cases
  if (
    // 수수료율 & 광고수주액 부분 수정 경우
    [
      agencyFeeRateInput,
      mediaFeeRateInput,
      dplanFeeRateInput,
      interFeeRateInput,
      totalFeeInput,
    ].includes(e.target)
  ) {
    agencyFeeInput.value =
      +totalFeeInput.value * (+agencyFeeRateInput.value / 100);
    mediaFeeInput.value =
      +totalFeeInput.value * (+mediaFeeRateInput.value / 100);
    dplanFeeInput.value =
      +totalFeeInput.value * (+dplanFeeRateInput.value / 100);
    interFeeInput.value =
      +totalFeeInput.value * (+interFeeRateInput.value / 100);
  } else {
    // 수익배분액 부분 수정 경우
    agencyFeeRateInput.value = (
      (+agencyFeeInput.value / +totalFeeInput.value) *
      100
    ).toFixed(2);
    mediaFeeRateInput.value = (
      (+mediaFeeInput.value / +totalFeeInput.value) *
      100
    ).toFixed(2);
    dplanFeeRateInput.value = (
      (+dplanFeeInput.value / +totalFeeInput.value) *
      100
    ).toFixed(2);
    interFeeRateInput.value = (
      (+interFeeInput.value / +totalFeeInput.value) *
      100
    ).toFixed(2);

    if (
      +totalFeeInput.value !==
      +agencyFeeInput.value +
        +mediaFeeInput.value +
        +dplanFeeInput.value +
        +interFeeInput.value
    ) {
      totalFeeInput.classList.add("error-border");
    } else {
      totalFeeInput.classList.remove("error-border");
    }
  }

  autoTotalCaculate();
}

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
    adFeeSum += +targetRow.cells[10].children[0].value;
    agencyFeeSum += +targetRow.cells[11].children[0].value;
    mediaFeeSum += +targetRow.cells[12].children[0].value;
    dplanFeeSum += +targetRow.cells[13].children[0].value;
    interFeeSum += +targetRow.cells[14].children[0].value;
  }
  lowerAdFeeSum.innerHTML = adFeeSum;
  lowerAgencyFeeSum.innerHTML = agencyFeeSum;
  lowerMediaFeeSum.innerHTML = mediaFeeSum;
  lowerDplanFeeSum.innerHTML = dplanFeeSum;
  lowerInterFeeSum.innerHTML = interFeeSum;

  // media total
  lowerAgencyFeeRateSum.innerHTML = ((agencyFeeSum / adFeeSum) * 100).toFixed(
    2
  );
  lowerMediaFeeRateSum.innerHTML = ((mediaFeeSum / adFeeSum) * 100).toFixed(2);
  lowerDplanFeeRateSum.innerHTML = ((dplanFeeSum / adFeeSum) * 100).toFixed(2);
  lowerInterFeeRateSum.innerHTML = ((interFeeSum / adFeeSum) * 100).toFixed(2);

  const camAdTotal = document.getElementById("cam-ad-total");
  const camAgencyFeeRate = document.getElementById("cam-agency-fee-rate");
  const camAgencyFee = document.getElementById("cam-agency-fee");

  camAdTotal.value = adFeeSum;
  camAgencyFeeRate.value = ((agencyFeeSum / adFeeSum) * 100).toFixed(2);
  camAgencyFee.value = agencyFeeSum;
}
////////////////////////////////////////////////////////////////////////

// event delegation
mediaTable.addEventListener("change", autoCalculate);

const startDate = document.getElementById("cam-start-date");
const endDate = document.getElementById("cam-end-date");

const setDate = document.getElementById("set-date");

function autoSetDate() {
  const len = mediaTable.rows.length;

  for (let i = 2; i < len - 1; i++) {
    mediaTable.rows[i].cells[1].children[0].value = startDate.value;
    mediaTable.rows[i].cells[2].children[0].value = endDate.value;
  }
}

setDate.addEventListener("click", autoSetDate);
