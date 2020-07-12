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
    
  for (let i = 2; i < mediaTable.rows.length-1; i++) {
    adSum += +mediaTable.rows[i].cells[10].innerHTML;
    agencySum += +mediaTable.rows[i].cells[11].innerHTML;
    mediaSum += +mediaTable.rows[i].cells[12].innerHTML;
    dplanSum += +mediaTable.rows[i].cells[13].innerHTML;
    interSum += +mediaTable.rows[i].cells[14].innerHTML;
    mediaTable.rows[i].cells[10].innerHTML = nf(+mediaTable.rows[i].cells[10].innerHTML)
    mediaTable.rows[i].cells[11].innerHTML = nf(+mediaTable.rows[i].cells[11].innerHTML)
    mediaTable.rows[i].cells[12].innerHTML = nf(+mediaTable.rows[i].cells[12].innerHTML)
    mediaTable.rows[i].cells[13].innerHTML = nf(+mediaTable.rows[i].cells[13].innerHTML)
    mediaTable.rows[i].cells[14].innerHTML = nf(+mediaTable.rows[i].cells[14].innerHTML)
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
