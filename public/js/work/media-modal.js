const mediaModalBtn = document.getElementById("media-modal-btn");

function alertModal(e) {
  const agencyTaxDate = document.getElementById("cam-tax-month");

  if (!startDate.value || !endDate.value) {
    alert("캠페인 기간을 입력하세요.");
    return;
  }

  if (!agencyInput.value) {
    alert("대행사를 입력하세요.");
    return;
  }

  if (!agencyTaxDate.value) {
    alert("대행사 세금계산서 발행월을 입력하세요.");
    return;
  }

  const formEl = e.target.closest("form");

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  const modal = document.createElement("div");
  modal.classList.add("modal", "media-modal");

  modal.innerHTML = `
  <div>
    <h3>매체 검색</h3>
    <br>
    <input type='text' style='width:100%' id='add-media' placeholder='매체이름' spellcheck="false"/>
    <p class="error-p" id="error-p"></p>
  </div>
  `;

  const btns = document.createElement("div");
  btns.classList.add("btns");
  btns.innerHTML = `
  <button class="btn" type="button" id="add-media-btn">추가</button>
  <button class="btn cancel-btn" type="button" id="cancel-btn">취소</button>
  `;

  modal.appendChild(btns);
  modalContainer.appendChild(modal);

  formEl.appendChild(modalContainer);

  // media auto complete
  const mediaInput = document.getElementById("add-media");
  mediaInput.focus();

  new autoComplete({
    selector: mediaInput,
    minChars: 1,
    source: function (term, suggest) {
      term = term.toLowerCase();
      const choices = mediaList.map((x) => {
        return x.name;
      });

      const matches = choices.filter((choice) => {
        return choice.toLowerCase().includes(term);
      });
      suggest(matches);
    },
  });

  const addMediaBtn = document.getElementById("add-media-btn");

  addMediaBtn.addEventListener("click", () => {
    const media_info = mediaList.find((x) => x.name === mediaInput.value);
    if (!media_info) {
      const errorP = document.getElementById("error-p");
      errorP.innerHTML = "매체를 새로 추가하거나 매체명을 확인하세요.";
      return;
    }

    const media_id = media_info.id;
    const media_name = media_info.name;
    const media_pay_condition = media_info.pay_condition;
    const media_inter_type = media_info.inter_type;
    const media_inter_name = media_info.inter_name;
    const media_agency_fee_rate = media_info.agency_fee_rate;
    const media_fee_rate = media_info.media_fee_rate;
    const media_dplan_fee_rate = media_info.dplan_fee_rate;
    const media_inter_fee_rate = media_info.inter_fee_rate;
    const media_bill_type = media_info.bill_type;

    const campaginEndDateArr = document
      .getElementById("cam-end-date")
      .value.split("-");
    const campaginEndMonth = `${campaginEndDateArr[0]}-${campaginEndDateArr[1]}`;

    // table row for adding media
    const newRowContent = `
    <input type="hidden" name="mediaItem_id" value=""/>
    <td>
      <input type="hidden" name="media_id" value="${media_id}" />
      <input type="text" value="${media_name}" style="width:88px" required readonly/>
    </td>
    <td>
      <input class="input-date" type="date" name="media_start" required/>
    </td>
    <td>
      <input class="input-date" type="date" name="media_end" required/>
    </td>
    <td>
      <select name="lower_inter_type">
        <option value="" ${media_inter_type === "" ? "selected" : ""}></option>
        <option value="in" ${
          media_inter_type === "in" ? "selected" : ""
        }>in</option>
        <option value="out" ${
          media_inter_type === "out" ? "selected" : ""
        }>out</option>
      </select>
    </td>
    <td>
      <input
        name="lower_inter_name"
        value="${media_inter_name}"
        type="text"
        style="width:6rem"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:2.5rem"
        type="text"
        name="lower_agency_fee_rate"
        value="${(+media_agency_fee_rate).toFixed(2)}"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:2.5rem"
        type="text"
        name="lower_media_fee_rate"
        value="${(+media_fee_rate).toFixed(2)}"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:2.5rem"
        type="text"
        name="lower_dplan_fee_rate"
        value="${(+media_dplan_fee_rate).toFixed(2)}"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:2.5rem"
        type="text"
        name="lower_inter_fee_rate"
        value="${(+media_inter_fee_rate).toFixed(2)}"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_ad_fee"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_agency_fee"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_media_fee"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_dplan_fee"
        value="0"
        required
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_inter_fee"
        value="0"
        required
      />
    </td>
    <td>
      <input class="input-date" type="date" name="agency_deposit_date" required/>
    </td>
    <td>
    <div style="display:flex;align-items:center;justify-content:center;">
      <input class="input-date" type="month" name="lower_issue_date" value="${campaginEndMonth}" required/>
      <select name="lower_issue_type">
        <option value="">선택</option>
        <option value="전액" ${
          media_bill_type === "전액" ? "selected" : ""
        }>전액</option>
        <option value="순액" ${
          media_bill_type === "순액" ? "selected" : ""
        }>순액</option>
      </select>
      </div>
    </td>
    <td>
      <input class="input-date" type="date" name="media_deposit_date"required/>
    </td>
    <td>
      <input
        class="input-num"
        style="width:6rem"
        type="text"
        name="google_cid"
      />
    </td>
    <td>
      <input
      name="lower_memo"
      style="width:68px"
      type="text"
    </td>
    <td>
      <button type="button" class="btn alert-btn">삭제</button>
    </td>
    <td hidden>
      <input type="hidden" value="${media_pay_condition}"/>
    </td>
    `;

    const len = mediaTable.rows.length;
    const row = mediaTable.insertRow(len - 1);
    row.innerHTML = newRowContent;

    mediaCount.value = +mediaCount.value + 1;
    modalContainer.remove();
  });

  const cancelBtn = document.getElementById("cancel-btn");
  cancelBtn.addEventListener("click", () => {
    modalContainer.remove();
  });
}

mediaModalBtn.addEventListener("click", alertModal);
