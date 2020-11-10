// 각 매체 자동 계산 함수
function autoCalculate(e) {
  // 숫자 부분만 함수적용
  if (!e.target.classList.contains("input-num")) return;
  if (e.target.getAttribute("name") === "google_cid") return;

  const targetRow = e.target.closest("tr");

  const agencyFeeRateInput = targetRow.cells[5].children[0];
  const mediaFeeRateInput = targetRow.cells[6].children[0];
  const dplanFeeRateInput = targetRow.cells[7].children[0];
  const interFeeRateInput = targetRow.cells[8].children[0];

  const agencyFeeInput = targetRow.cells[10].children[0];
  const mediaFeeInput = targetRow.cells[11].children[0];
  const dplanFeeInput = targetRow.cells[12].children[0];
  const interFeeInput = targetRow.cells[13].children[0];

  const totalFeeInput = targetRow.cells[9].children[0];

  agencyFeeInput.value = agencyFeeInput.value.replace(/,/gi, "");
  mediaFeeInput.value = mediaFeeInput.value.replace(/,/gi, "");
  dplanFeeInput.value = dplanFeeInput.value.replace(/,/gi, "");
  interFeeInput.value = interFeeInput.value.replace(/,/gi, "");

  totalFeeInput.value = totalFeeInput.value.replace(/,/gi, "");

  let agencyPercent, mediaPercent, dplanPercent, interPercent;

  switch (e.target) {
    case agencyFeeRateInput:
      agencyFeeInput.value = (
        +totalFeeInput.value *
        (+agencyFeeRateInput.value / 100)
      ).toFixed();
      break;
    case mediaFeeRateInput:
      mediaFeeInput.value = (
        +totalFeeInput.value *
        (+mediaFeeRateInput.value / 100)
      ).toFixed();
      break;
    case dplanFeeRateInput:
      dplanFeeInput.value = (
        +totalFeeInput.value *
        (+dplanFeeRateInput.value / 100)
      ).toFixed();
      break;
    case interFeeRateInput:
      interFeeInput.value = (
        +totalFeeInput.value *
        (+interFeeRateInput.value / 100)
      ).toFixed();
      break;

    case agencyFeeInput:
      agencyPercent = (+agencyFeeInput.value / +totalFeeInput.value) * 100;
      agencyFeeRateInput.value =
        agencyPercent === 100 ? agencyPercent : agencyPercent.toFixed(2);

      dplanFeeInput.value =
        +totalFeeInput.value -
        (+agencyFeeInput.value + +mediaFeeInput.value + +interFeeInput.value);

      dplanPercent = (+dplanFeeInput.value / +totalFeeInput.value) * 100;
      dplanFeeRateInput.value =
        dplanPercent === 100 ? dplanPercent : dplanPercent.toFixed(2);
      break;
    case mediaFeeInput:
      mediaPercent = (+mediaFeeInput.value / +totalFeeInput.value) * 100;
      mediaFeeRateInput.value =
        mediaPercent === 100 ? mediaPercent : mediaPercent.toFixed(2);

      dplanFeeInput.value =
        +totalFeeInput.value -
        (+agencyFeeInput.value + +mediaFeeInput.value + +interFeeInput.value);

      dplanPercent = (+dplanFeeInput.value / +totalFeeInput.value) * 100;
      dplanFeeRateInput.value =
        dplanPercent === 100 ? dplanPercent : dplanPercent.toFixed(2);
      break;
    case dplanFeeInput:
      dplanPercent = (+dplanFeeInput.value / +totalFeeInput.value) * 100;
      dplanFeeRateInput.value =
        dplanPercent === 100 ? dplanPercent : dplanPercent.toFixed(2);
      break;
    case interFeeInput:
      interPercent = (+interFeeInput.value / +totalFeeInput.value) * 100;
      interFeeRateInput.value =
        interPercent === 100 ? interPercent : interPercent.toFixed(2);

      dplanFeeInput.value =
        +totalFeeInput.value -
        (+agencyFeeInput.value + +mediaFeeInput.value + +interFeeInput.value);

      dplanPercent = (+dplanFeeInput.value / +totalFeeInput.value) * 100;
      dplanFeeRateInput.value =
        dplanPercent === 100 ? dplanPercent : dplanPercent.toFixed(2);
      break;
    case totalFeeInput:
      agencyFeeInput.value = (
        +totalFeeInput.value *
        (+agencyFeeRateInput.value / 100)
      ).toFixed();
      mediaFeeInput.value = (
        +totalFeeInput.value *
        (+mediaFeeRateInput.value / 100)
      ).toFixed();
      dplanFeeInput.value = (
        +totalFeeInput.value *
        (+dplanFeeRateInput.value / 100)
      ).toFixed();
      interFeeInput.value = (
        +totalFeeInput.value *
        (+interFeeRateInput.value / 100)
      ).toFixed();
      break;
  }

  errorCheck(
    totalFeeInput.value,
    agencyFeeInput,
    mediaFeeInput,
    dplanFeeInput,
    interFeeInput
  );

  autoTotalCaculate();
}

function errorCheck(total, ...args) {
  const sum = args.reduce((acc, cur) => acc + +cur.value, 0);

  if (+total !== sum) {
    args.forEach((element) => {
      element.classList.add("error-border");
    });
  } else {
    args.forEach((element) => {
      element.classList.remove("error-border");
    });
  }
}
