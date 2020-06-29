const mediaModalBtn = document.getElementById("media-modal-btn");

function alertModal(e) {
  const formEl = e.target.closest("form");

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  const modal = document.createElement("div");
  modal.classList.add("modal", "media-modal");

  modal.innerHTML = `
  <div>
    <h3>➣ 매체명 검색</h3>
    <br>
    <input type='text' style='width:100%' id='add-media' placeholder='매체명' />
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
  console.log(mediaInput);
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
    if (!media_info) return;

    const media_name = media_info.name;
    const media_inter_type = media_info.inter_type;
    const media_inter_name = media_info.inter_name;
    const media_agency_fee_rate = media_info.agency_fee_rate;
    const media_fee_rate = media_info.media_fee_rate;
    const media_dplan_fee_rate = media_info.dplan_fee_rate;
    const media_inter_fee_rate = media_info.inter_fee_rate;

    const newRowContent = `
    <td>
      <input type="text" name="media_name" style="width:88px" value="${media_name}"readonly/>
    </td>
    <td>
      <input class="input-date" type="date" name="media_start" />
    </td>
    <td>
      <input class="input-date" type="date" name="media_end" />
    </td>
    <td>
      <select name="lower_inter_type" id="lower-inter-type">
        <option value=""></option>
        <option value="in">in</option>
        <option value="out">out</option>
      </select>
    </td>
    <td>
      <input
        name="lower_inter_name"
        value="${media_inter_name}"
        id="lower-inter-name"
        type="text"
        style="width:88px"
      />
    </td>
    <td>
      <input class="input-date" type="month"/>
      <select name="lower_issue_type">
        <option value="전액">전액</option>
        <option value="순액">순액</option>
      </select>
    </td>
    <td>
      <input
        class="input-num"
        style="width:24px"
        type="text"
        name="lower_agency_fee_rate"
        value="${media_agency_fee_rate}"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:24px"
        type="text"
        name="lower_media_fee_rate"
        value="${media_fee_rate}"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:24px"
        type="text"
        name="lower_dplan_fee_rate"
        value="${media_dplan_fee_rate}"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:24px"
        type="text"
        name="lower_inter_fee_rate"
        value="${media_inter_fee_rate}"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_ad_fee"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_agency_fee"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_media_fee"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_dplan_fee"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:88px"
        type="text"
        name="lower_inter_fee"
        value="0"
      />
    </td>
    <td>
      <input
        class="input-num"
        style="width:68px"
        type="text"
        name="google-cid"
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
    </td>`;

    const len = mediaTable.rows.length;
    const row = mediaTable.insertRow(len - 1);
    row.innerHTML = newRowContent;

    // media delete button
    const deleteBtn = row.cells[row.cells.length - 1].children[0];
    deleteBtn.addEventListener("click", (e) => {
      e.target.closest("tr").remove();
    });
    modalContainer.remove();
  });

  const cancelBtn = document.getElementById("cancel-btn");
  cancelBtn.addEventListener("click", () => {
    modalContainer.remove();
  });
}

mediaModalBtn.addEventListener("click", alertModal);
