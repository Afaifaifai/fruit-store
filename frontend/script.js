const API_BASE_URL = 'http://localhost:8080/api'; // 後端 API 的基礎網址

// 全局變數
let selectedRow = null;
let pendingOperation = null; // 用於追蹤當前的操作（add, select, edit, delete）
let pendingTable = null; // 用於追蹤當前操作的表格

// 動態加載表格資料
function loadData(table) {
  const tables = document.querySelectorAll('.table-container');
  tables.forEach(t => t.classList.add('hidden'));
  const targetTable = document.getElementById(table);
  if (targetTable) {
    targetTable.classList.remove('hidden');
    fetchData(table); // 從後端獲取資料
  }
}

// 從後端 API 獲取資料
async function fetchData(table) {
  try {
    const response = await fetch(`${API_BASE_URL}/${table}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    renderTable(table, data);
  } catch (error) {
    console.error('資料加載失敗:', error);
    alert('無法加載資料，請檢查後端伺服器狀態！');
  }
}

// 渲染表格內容
function renderTable(table, data) {
  const tableBody = document.querySelector(`#${table} tbody`);
  tableBody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    Object.entries(row).forEach(([key, value]) => {
      const td = document.createElement('td');
      if (key.toLowerCase() === 'photo') { // 處理圖片欄位
        const img = document.createElement('img');
        img.src = value;
        td.appendChild(img);
      } else {
        td.textContent = value;
        // 為住址欄位添加工具提示
        if ((table === 'members' || table === 'inactive') && key.toLowerCase() === 'address') {
          td.setAttribute('title', value);
        }
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  // 添加行點擊事件以選擇記錄
  tableBody.querySelectorAll('tr').forEach(tr => {
    tr.addEventListener('click', () => {
      if (selectedRow) {
        selectedRow.classList.remove('selected');
      }
      selectedRow = tr;
      selectedRow.classList.add('selected');
    });
  });
}

// 開啟 Modal
function openModal(table, action) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalForm = document.getElementById('modal-form');

//   if (action === 'edit' || action === 'delete') {
//     // 設定待處理的操作和表格
//     pendingOperation = action;
//     pendingTable = table;

//     // 設定模態框標題為「查詢資料」
//     modalTitle.textContent = '查詢資料';

//     // 生成查詢表單
//     modalForm.innerHTML = generateForm(table, action);
//     modal.style.display = 'block';
//   } else {
    // 對於其他操作（add, select），正常處理
    pendingOperation = action;
    pendingTable = table;

    modalTitle.textContent = `${action === 'add' ? '新增' : action === 'edit' ? '修改' : action === 'delete' ? '刪除' : '查詢'}資料`;
    modalForm.innerHTML = generateForm(table, action);
    modal.style.display = 'block';
//   }
}

// 關閉 Modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// 生成表單 HTML
function generateForm(table, action) {
  let formHTML = '';
  switch(table) {
    case 'fruits':
      formHTML += generateFruitsForm(table, action);
      break;
    case 'members':
      formHTML += generateMembersForm(table, action);
      break;
    case 'inactive':
      formHTML += generateInactiveForm(table, action);
      break;
    case 'suppliers':
      formHTML += generateSuppliersForm(table, action);
      break;
    case 'transactions':
      formHTML += generateTransactionsForm(table, action);
      break;
    default:
      formHTML = '';
  }
  // 標註必填內容並添加提交按鈕
//   if (action !== 'select') {
    formHTML += `<button type="submit" class="submit-btn">${action === 'add' ? '新增' : action === 'edit' ? '修改' : action === 'delete' ? '刪除' : '查詢'}</button>`;
//   } else {
//     formHTML += `<button type="submit" class="submit-btn">123</button>`;
//   }
  return formHTML;
}

// 生成水果資料表的表單
function generateFruitsForm(table, action) {
  let formHTML = '';
  const required = 'required';
  if (action === 'add') {
    formHTML += `
      <label for="fruit_id">水果編號 <span style="color:red;">*</span>:</label>
      <input type="text" id="fruit_id" name="fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}" ${required}>

      <label for="fruit_name">水果名稱:</label>
      <input type="text" id="fruit_name" name="fruit_name" maxlength="12">

      <label for="supplier_name">水果供應商名稱:</label>
      <input type="text" id="supplier_name" name="supplier_name" maxlength="12">

      <label for="quantity">現有數量:</label>
      <input type="number" id="quantity" name="quantity" max="999999">

      <label for="unit">單位:</label>
      <input type="text" id="unit" name="unit" maxlength="4">

      <label for="purchase_price">進貨單價:</label>
      <input type="number" step="0.01" id="purchase_price" name="purchase_price" max="999999.99">

      <label for="storage_location">公司內存放位置:</label>
      <input type="text" id="storage_location" name="storage_location" maxlength="12">

      <label for="purchase_date">進貨日期:</label>
      <input type="date" id="purchase_date" name="purchase_date">

      <label for="promotion_start_date">開始促銷日期:</label>
      <input type="date" id="promotion_start_date" name="promotion_start_date">

      <label for="discard_date">該丟棄之日期:</label>
      <input type="date" id="discard_date" name="discard_date">
    `;
  } else if (action === 'select' || action === 'delete') {
    // 查詢或修改模式，所有欄位均為選填
    formHTML += `
      <label for="fruit_id">水果編號:</label>
      <input type="text" id="fruit_id" name="fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}">

      <label for="fruit_name">水果名稱:</label>
      <input type="text" id="fruit_name" name="fruit_name" maxlength="12">

      <label for="supplier_name">水果供應商名稱:</label>
      <input type="text" id="supplier_name" name="supplier_name" maxlength="12">

      <label for="quantity">現有數量:</label>
      <input type="number" id="quantity" name="quantity" max="999999">

      <label for="unit">單位:</label>
      <input type="text" id="unit" name="unit" maxlength="4">

      <label for="purchase_price">進貨單價:</label>
      <input type="number" step="0.01" id="purchase_price" name="purchase_price" max="999999.99">

      <label for="storage_location">公司內存放位置:</label>
      <input type="text" id="storage_location" name="storage_location" maxlength="12">

      <label for="purchase_date">進貨日期:</label>
      <input type="date" id="purchase_date" name="purchase_date">

      <label for="promotion_start_date">開始促銷日期:</label>
      <input type="date" id="promotion_start_date" name="promotion_start_date">

      <label for="discard_date">該丟棄之日期:</label>
      <input type="date" id="discard_date" name="discard_date">
    `;
  } else if (action === 'edit') {
    // 修改操作的表單：分為條件和修改數值兩個部分
    formHTML += `
      <h3>條件</h3>
      <div class="form-section">
        <label for="condition_fruit_id">水果編號:</label>
        <input type="text" id="condition_fruit_id" name="condition_fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}">

        <label for="condition_member_id">會員身分證字號:</label>
        <input type="text" id="condition_member_id" name="condition_member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

        <label for="condition_fruit_name">水果名稱:</label>
        <input type="text" id="condition_fruit_name" name="condition_fruit_name" maxlength="12">

        <label for="condition_supplier_name">水果供應商名稱:</label>
        <input type="text" id="condition_supplier_name" name="condition_supplier_name" maxlength="12">

        <label for="condition_quantity">購買數量:</label>
        <input type="number" id="condition_quantity" name="condition_quantity" max="999999">

        <label for="condition_sale_price">出售單價:</label>
        <input type="number" step="0.01" id="condition_sale_price" name="condition_sale_price" max="999999.99">

        <label for="condition_transaction_date">交易日期:</label>
        <input type="date" id="condition_transaction_date" name="condition_transaction_date">

        <label for="condition_expected_shipping_date">預計交運日期:</label>
        <input type="date" id="condition_expected_shipping_date" name="condition_expected_shipping_date">

        <label for="condition_actual_shipping_date">實際交運日期:</label>
        <input type="date" id="condition_actual_shipping_date" name="condition_actual_shipping_date">
      </div>

      <h3>修改數值</h3>
      <div class="form-section">
        <label for="update_fruit_id">水果編號:</label>
        <input type="text" id="update_fruit_id" name="update_fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}">

        <label for="update_member_id">會員身分證字號:</label>

        <input type="text" id="update_member_id" name="update_member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

        <label for="update_fruit_name">水果名稱:</label>
        <input type="text" id="update_fruit_name" name="update_fruit_name" maxlength="12">

        <label for="update_supplier_name">水果供應商名稱:</label>
        <input type="text" id="update_supplier_name" name="update_supplier_name" maxlength="12">

        <label for="update_quantity">購買數量:</label>
        <input type="number" id="update_quantity" name="update_quantity" max="999999">

        <label for="update_sale_price">出售單價:</label>
        <input type="number" step="0.01" id="update_sale_price" name="update_sale_price" max="999999.99">

        <label for="update_transaction_date">交易日期:</label>
        <input type="date" id="update_transaction_date" name="update_transaction_date">

        <label for="update_expected_shipping_date">預計交運日期:</label>
        <input type="date" id="update_expected_shipping_date" name="update_expected_shipping_date">

        <label for="update_actual_shipping_date">實際交運日期:</label>
        <input type="date" id="update_actual_shipping_date" name="update_actual_shipping_date">
      </div>
    `;
  }
  return formHTML;
}

// 生成會員資料表的表單
function generateMembersForm(table, action) {
  let formHTML = '';
  const required = 'required';
  if (action === 'add') {
    formHTML += `
      <label for="member_id">會員身分證字號 <span style="color:red;">*</span>:</label>
      <input type="text" id="member_id" name="member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}" ${required}>

      <label for="member_name">會員姓名:</label>
      <input type="text" id="member_name" name="member_name" maxlength="12">

      <label for="phone">電話:</label>
      <input type="text" id="phone" name="phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

      <label for="mobile">手機號碼:</label>
      <input type="text" id="mobile" name="mobile" maxlength="16" pattern="\\d{4}-\\d{3}-\\d{3}">

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" maxlength="36">

      <label for="line_joined">是否加入Line:</label>
      <select id="line_joined" name="line_joined">
        <option value="">請選擇</option>
        <option value="是">是</option>
        <option value="不是">不是</option>
      </select>

      <label for="address">住址:</label>
      <textarea id="address" name="address" maxlength="60"></textarea>

      <label for="age">年齡:</label>
      <input type="number" id="age" name="age" min="0" max="9999">

      <label for="photo">照片:</label>
      <input type="file" id="photo" name="photo" accept="image/*">

      <label for="discount">會員折扣:</label>
      <input type="number" step="0.01" id="discount" name="discount" min="0" max="9.99">
    `;
  } else if (action === 'select' || action === 'delete') {
    // 查詢或修改模式，所有欄位均為選填
    formHTML += `
      <label for="member_id">會員身分證字號:</label>
      <input type="text" id="member_id" name="member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

      <label for="member_name">會員姓名:</label>
      <input type="text" id="member_name" name="member_name" maxlength="12">

      <label for="phone">電話:</label>
      <input type="text" id="phone" name="phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

      <label for="mobile">手機號碼:</label>
      <input type="text" id="mobile" name="mobile" maxlength="16" pattern="\\d{4}-\\d{3}-\\d{3}">

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" maxlength="36">

      <label for="line_joined">是否加入Line:</label>
      <select id="line_joined" name="line_joined">
        <option value="">請選擇</option>
        <option value="是">是</option>
        <option value="不是">不是</option>
      </select>

      <label for="address">住址:</label>
      <textarea id="address" name="address" maxlength="60"></textarea>

      <label for="age">年齡:</label>
      <input type="number" id="age" name="age" min="0" max="9999">

      <label for="photo">照片:</label>
      <input type="file" id="photo" name="photo" accept="image/*">

      <label for="discount">會員折扣:</label>
      <input type="number" step="0.01" id="discount" name="discount" min="0" max="9.99">
    `;
  } else if (action === 'edit') {
    // 修改操作的表單：分為條件和修改數值兩個部分
    formHTML += `
      <h3>條件</h3>
      <div class="form-section">
        <label for="condition_member_id">會員身分證字號:</label>
        <input type="text" id="condition_member_id" name="condition_member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

        <label for="condition_member_name">會員姓名:</label>
        <input type="text" id="condition_member_name" name="condition_member_name" maxlength="12">

        <label for="condition_phone">電話:</label>
        <input type="text" id="condition_phone" name="condition_phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

        <label for="condition_mobile">手機號碼:</label>
        <input type="text" id="condition_mobile" name="condition_mobile" maxlength="16" pattern="\\d{4}-\\d{3}-\\d{3}">

        <label for="condition_email">Email:</label>
        <input type="email" id="condition_email" name="condition_email" maxlength="36">

        <label for="condition_line_joined">是否加入Line:</label>
        <select id="condition_line_joined" name="condition_line_joined">
          <option value="">請選擇</option>
          <option value="是">是</option>
          <option value="不是">不是</option>
        </select>

        <label for="condition_address">住址:</label>
        <textarea id="condition_address" name="condition_address" maxlength="60"></textarea>

        <label for="condition_age">年齡:</label>
        <input type="number" id="condition_age" name="condition_age" min="0" max="9999">

        <label for="condition_discount">會員折扣:</label>
        <input type="number" step="0.01" id="condition_discount" name="condition_discount" min="0" max="9.99">
      </div>

      <h3>修改數值</h3>
      <div class="form-section">
        <label for="update_member_id">會員身分證字號:</label>
        <input type="text" id="update_member_id" name="update_member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

        <label for="update_member_name">會員姓名:</label>
        <input type="text" id="update_member_name" name="update_member_name" maxlength="12">

        <label for="update_phone">電話:</label>
        <input type="text" id="update_phone" name="update_phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

        <label for="update_mobile">手機號碼:</label>
        <input type="text" id="update_mobile" name="update_mobile" maxlength="16" pattern="\\d{4}-\\d{3}-\\d{3}">

        <label for="update_email">Email:</label>
        <input type="email" id="update_email" name="update_email" maxlength="36">

        <label for="update_line_joined">是否加入Line:</label>
        <select id="update_line_joined" name="update_line_joined">
          <option value="">請選擇</option>
          <option value="是">是</option>
          <option value="不是">不是</option>
        </select>

        <label for="update_address">住址:</label>
        <textarea id="update_address" name="update_address" maxlength="60"></textarea>

        <label for="update_age">年齡:</label>
        <input type="number" id="update_age" name="update_age" min="0" max="9999">

        <label for="update_discount">會員折扣:</label>
        <input type="number" step="0.01" id="update_discount" name="update_discount" min="0" max="9.99">
      </div>
    `;
  }
  return formHTML;
}

// 生成靜止會員資料表的表單
function generateInactiveForm(table, action) {
  // 與 generateMembersForm 相同
  return generateMembersForm(table, action);
}

// 生成供應商資料表的表單
function generateSuppliersForm(table, action) {
  let formHTML = '';
  const required = 'required';
  if (action === 'add') {
    formHTML += `
      <label for="supplier_id">供應商統一編號 <span style="color:red;">*</span>:</label>
      <input type="text" id="supplier_id" name="supplier_id" maxlength="8" pattern="\\d{8}" ${action === 'add' ? required : ''}>

      <label for="supplier_name">水果供應商名稱:</label>
      <input type="text" id="supplier_name" name="supplier_name" maxlength="12">

      <label for="phone">電話:</label>
      <input type="text" id="phone" name="phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" maxlength="36">

      <label for="address">住址:</label>
      <textarea id="address" name="address" maxlength="60"></textarea>

      <label for="manager_name">負責人姓名:</label>
      <input type="text" id="manager_name" name="manager_name" maxlength="12">
    `;
  } else if (action === 'select' || action === 'delete') {
    // 查詢或刪除模式，所有欄位均為選填
    formHTML += `
      <label for="supplier_id">供應商統一編號:</label>
      <input type="text" id="supplier_id" name="supplier_id" maxlength="8" pattern="\\d{8}">

      <label for="supplier_name">水果供應商名稱:</label>
      <input type="text" id="supplier_name" name="supplier_name" maxlength="12">

      <label for="phone">電話:</label>
      <input type="text" id="phone" name="phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" maxlength="36">

      <label for="address">住址:</label>
      <textarea id="address" name="address" maxlength="60"></textarea>

      <label for="manager_name">負責人姓名:</label>
      <input type="text" id="manager_name" name="manager_name" maxlength="12">
    `;
  } else if (action === 'edit') {
    // 修改操作的表單：分為條件和修改數值兩個部分
    formHTML += `
      <h3>條件</h3>
      <div class="form-section">
        <label for="condition_supplier_id">供應商統一編號:</label>
        <input type="text" id="condition_supplier_id" name="condition_supplier_id" maxlength="8" pattern="\\d{8}">

        <label for="condition_supplier_name">水果供應商名稱:</label>
        <input type="text" id="condition_supplier_name" name="condition_supplier_name" maxlength="12">

        <label for="condition_phone">電話:</label>
        <input type="text" id="condition_phone" name="condition_phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

        <label for="condition_email">Email:</label>
        <input type="email" id="condition_email" name="condition_email" maxlength="36">

        <label for="condition_address">住址:</label>
        <textarea id="condition_address" name="condition_address" maxlength="60"></textarea>

        <label for="condition_manager_name">負責人姓名:</label>
        <input type="text" id="condition_manager_name" name="condition_manager_name" maxlength="12">
      </div>

      <h3>修改數值</h3>
      <div class="form-section">
        <label for="update_supplier_id">供應商統一編號:</label>
        <input type="text" id="update_supplier_id" name="update_supplier_id" maxlength="8" pattern="\\d{8}">

        <label for="update_supplier_name">水果供應商名稱:</label>
        <input type="text" id="update_supplier_name" name="update_supplier_name" maxlength="12">

        <label for="update_phone">電話:</label>
        <input type="text" id="update_phone" name="update_phone" maxlength="16" pattern="\\d{2}-\\d{4}-\\d{4}">

        <label for="update_email">Email:</label>
        <input type="email" id="update_email" name="update_email" maxlength="36">

        <label for="update_address">住址:</label>
        <textarea id="update_address" name="update_address" maxlength="60"></textarea>

        <label for="update_manager_name">負責人姓名:</label>
        <input type="text" id="update_manager_name" name="update_manager_name" maxlength="12">
      </div>
    `;
  }
  return formHTML;
}

// 生成交易資料表的表單
function generateTransactionsForm(table, action) {
  let formHTML = '';
  const required = 'required';
  if (action === 'add') {
    formHTML += `
      <label for="fruit_id">水果編號 <span style="color:red;">*</span>:</label>
      <input type="text" id="fruit_id" name="fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}" ${required}>

      <label for="member_id">會員身分證字號:</label>
      <input type="text" id="member_id" name="member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

      <label for="fruit_name">水果名稱:</label>
      <input type="text" id="fruit_name" name="fruit_name" maxlength="12">

      <label for="supplier_name">水果供應商名稱:</label>
      <input type="text" id="supplier_name" name="supplier_name" maxlength="12">

      <label for="purchase_quantity">購買數量:</label>
      <input type="number" id="purchase_quantity" name="purchase_quantity" max="999999">

      <label for="sale_price">出售單價:</label>
      <input type="number" step="0.01" id="sale_price" name="sale_price" max="999999.99">

      <label for="transaction_date">交易日期:</label>
      <input type="date" id="transaction_date" name="transaction_date">

      <label for="expected_shipping_date">預計交運日期:</label>
      <input type="date" id="expected_shipping_date" name="expected_shipping_date">

      <label for="actual_shipping_date">實際交運日期:</label>
      <input type="date" id="actual_shipping_date" name="actual_shipping_date"  >
    `;
  } else if (action === 'select' || action === 'delete') {
    // 查詢或刪除模式，所有欄位均為選填
    formHTML += `
      <label for="fruit_id">水果編號:</label>
      <input type="text" id="fruit_id" name="fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}">

      <label for="member_id">會員身分證字號:</label>
      <input type="text" id="member_id" name="member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

      <label for="fruit_name">水果名稱:</label>
      <input type="text" id="fruit_name" name="fruit_name" maxlength="12">

      <label for="supplier_name">水果供應商名稱:</label>
      <input type="text" id="supplier_name" name="supplier_name" maxlength="12">

      <label for="purchase_quantity">購買數量:</label>
      <input type="number" id="purchase_quantity" name="purchase_quantity" max="999999">

      <label for="sale_price">出售單價:</label>
      <input type="number" step="0.01" id="sale_price" name="sale_price" max="999999.99">

      <label for="transaction_date">交易日期:</label>
      <input type="date" id="transaction_date" name="transaction_date">

      <label for="expected_shipping_date">預計交運日期:</label>
      <input type="date" id="expected_shipping_date" name="expected_shipping_date">

      <label for="actual_shipping_date">實際交運日期:</label>
      <input type="date" id="actual_shipping_date" name="actual_shipping_date">
    `;
  } else if (action === 'edit') {
    // 修改操作的表單：分為條件和修改數值兩個部分
    formHTML += `
      <h3>條件</h3>
      <div class="form-section">
        <label for="condition_fruit_id">水果編號:</label>
        <input type="text" id="condition_fruit_id" name="condition_fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}">

        <label for="condition_member_id">會員身分證字號:</label>
        <input type="text" id="condition_member_id" name="condition_member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

        <label for="condition_fruit_name">水果名稱:</label>
        <input type="text" id="condition_fruit_name" name="condition_fruit_name" maxlength="12">

        <label for="condition_supplier_name">水果供應商名稱:</label>
        <input type="text" id="condition_supplier_name" name="condition_supplier_name" maxlength="12">

        <label for="condition_purchase_quantity">購買數量:</label>
        <input type="number" id="condition_purchase_quantity" name="condition_purchase_quantity" max="999999">

        <label for="condition_sale_price">出售單價:</label>
        <input type="number" step="0.01" id="condition_sale_price" name="condition_sale_price" max="999999.99">

        <label for="condition_transaction_date">交易日期:</label>
        <input type="date" id="condition_transaction_date" name="condition_transaction_date">

        <label for="condition_expected_shipping_date">預計交運日期:</label>
        <input type="date" id="condition_expected_shipping_date" name="condition_expected_shipping_date">

        <label for="condition_actual_shipping_date">實際交運日期:</label>
        <input type="date" id="condition_actual_shipping_date" name="condition_actual_shipping_date">
      </div>

      <h3>修改數值</h3>
      <div class="form-section">
        <label for="update_fruit_id">水果編號:</label>
        <input type="text" id="update_fruit_id" name="update_fruit_id" maxlength="13" pattern="\\d{2}-\\d{3}-\\d{3}-\\d{2}">

        <label for="update_member_id">會員身分證字號:</label>
        <input type="text" id="update_member_id" name="update_member_id" maxlength="10" pattern="[A-Z]{1}\\d{9}">

        <label for="update_fruit_name">水果名稱:</label>
        <input type="text" id="update_fruit_name" name="update_fruit_name" maxlength="12">

        <label for="update_supplier_name">水果供應商名稱:</label>
        <input type="text" id="update_supplier_name" name="update_supplier_name" maxlength="12">

        <label for="update_purchase_quantity">購買數量:</label>
        <input type="number" id="update_purchase_quantity" name="update_purchase_quantity" max="999999">

        <label for="update_sale_price">出售單價:</label>
        <input type="number" step="0.01" id="update_sale_price" name="update_sale_price" max="999999.99">

        <label for="update_transaction_date">交易日期:</label>
        <input type="date" id="update_transaction_date" name="update_transaction_date">

        <label for="update_expected_shipping_date">預計交運日期:</label>
        <input type="date" id="update_expected_shipping_date" name="update_expected_shipping_date">

        <label for="update_actual_shipping_date">實際交運日期:</label>
        <input type="date" id="update_actual_shipping_date" name="update_actual_shipping_date">
      </div>
    `;
  }
  return formHTML;
}

// 填充表單數據（編輯模式）
function populateForm(table, row) {
  const form = document.getElementById('modal-form');
  switch(table) {
    case 'fruits':
      form.fruit_id.value = row.fruit_id;
      form.fruit_name.value = row.fruit_name;
      form.supplier_name.value = row.supplier_name;
      form.quantity.value = row.quantity;
      form.unit.value = row.unit;
      form.purchase_price.value = row.purchase_price;
      form.storage_location.value = row.storage_location;
      form.purchase_date.value = row.purchase_date;
      form.promotion_start_date.value = row.promotion_start_date;
      form.discard_date.value = row.discard_date;
      break;

    case 'members':
    case 'inactive':
      form.member_id.value = row.member_id;
      form.member_name.value = row.member_name;
      form.phone.value = row.phone;
      form.mobile.value = row.mobile;
      form.email.value = row.email;
      form.line_joined.value = row.line_joined;
      form.address.value = row.address;
      form.age.value = row.age;
      form.discount.value = row.discount;
      break;

    case 'suppliers':
      form.supplier_id.value = row.supplier_id;
      form.supplier_name.value = row.supplier_name;
      form.phone.value = row.phone;
      form.email.value = row.email;
      form.address.value = row.address;
      form.manager_name.value = row.manager_name;
      break;

    case 'transactions':
      form.fruit_id.value = row.fruit_id;
      form.member_id.value = row.member_id;
      form.fruit_name.value = row.fruit_name;
      form.supplier_name.value = row.supplier_name;
      form.purchase_quantity.value = row.purchase_quantity;
      form.sale_price.value = row.sale_price;
      form.transaction_date.value = row.transaction_date;
      form.expected_shipping_date.value = row.expected_shipping_date;
      form.actual_shipping_date.value = row.actual_shipping_date;
      break;

    default:
      break;
  }
}

// 關閉 Modal 點擊空白處關閉
window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// 處理表單提交
document.getElementById('modal-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const table = pendingTable;
    const operation = pendingOperation;
    const formData = new FormData(form);
    const data = {};
    const conditions = {};
    const updates = {};
  
    // 根據字段名稱區分條件與更新數值
    formData.forEach((value, key) => {
      if (key.startsWith('condition_')) {
        // 條件部分
        const conditionKey = key.replace('condition_', '');
        if (value) 
          conditions[conditionKey] = value; // 忽略空值
      } else if (key.startsWith('update_')) {
        // 更新數值部分
        const updateKey = key.replace('update_', '');
        if (value) 
          updates[updateKey] = value; // 忽略空值
      } else {
        // 其他操作，例如新增或查詢
        data[key] = value;
      }
    });
  
    if (operation === 'select') {  // 查詢
      // 普通查詢操作
      selectRecord(table, data).then(selectedData => {
        if (selectedData.length === 1 && pendingOperation) {
          const selectedRowData = selectedData[0];
          openEditDeleteForm(operation, table, selectedRowData);
        } else if (selectedData.length === 1 && !pendingOperation) {
          // 若操作已經是 'edit' 或 'delete'，不進一步操作
          closeModal();
        } else if (selectedData.length === 0) {
          alert('未找到符合條件的記錄。');
        } else {
          alert('請精確查詢僅選擇一條記錄。');
        }
      }).catch(error => {
        console.error('查詢失敗:', error);
        alert('查詢失敗，請稍後再試。');
      });
    } else if (operation === 'edit' || operation === 'delete') {  // 修改和刪除
      // 修改或刪除操作
      if (operation === 'edit') {
        if (Object.keys(conditions).length === 0) {
          alert('請至少提供一個條件！');
          return;
        }
        if (Object.keys(updates).length === 0) {
          alert('請至少提供一個修改數值！');
          return;
        }
        updateRecord(table, { conditions, updates });
      } else if (operation === 'delete') {
        if (Object.keys(conditions).length === 0) {
          alert('請提供至少一個刪除條件！');
          return;
        }
        deleteRecord(table, conditions);
      }
      closeModal();
    } else {  //  新增
      // 其他操作（add）
      if (operation === 'add') {
        // 處理圖片上傳（將圖片轉換為 Base64 字符串）
        const photoInput = form.querySelector('input[type="file"]');
        if (photoInput && photoInput.files.length > 0) {
          const file = photoInput.files[0];
          const reader = new FileReader();
          reader.onloadend = function() {
            data['photo'] = reader.result; // 將圖片轉換為 Base64
            createRecord(table, data);
          };
          reader.readAsDataURL(file);
        } else {
          createRecord(table, data);
        }
      }
      closeModal();
    }
});

// 執行操作
function executeOperation(operation, table, data) {
  if (operation === '新增') {
    createRecord(table, data);
  } else if (operation === '修改') {
    updateRecord(table, data);
  } else if (operation === '刪除') {
    deleteRecord(table, data);
  } else if (operation === '移轉') {
    transferRecord(table, data);
  } else if (operation === '查詢') {
    selectRecord(table, data);
  }
}

// 獲取當前顯示的表格名稱
function getCurrentTable() {
  const tables = document.querySelectorAll('.table-container');
  for (const table of tables) {
    if (!table.classList.contains('hidden')) {
      return table.id;
    }
  }
  return null;
}

// 新增資料
async function createRecord(table, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert('新增成功！');
      fetchData(table);
    } else {
      const errorData = await response.json();
      alert(`新增失敗：${errorData.message}`);
    }
  } catch (error) {
    console.error('新增資料失敗:', error);
    alert('無法新增資料，請檢查後端伺服器狀態！');
  }
}

// 修改資料
async function updateRecord(table, data) {
    const { conditions, updates } = data;

    if (!conditions || Object.keys(conditions).length === 0) {
      alert('請提供至少一個更新條件！');
      return;
    }
  
    if (!updates || Object.keys(updates).length === 0) {
      alert('請提供至少一個要更新的數值！');
      return;
    }

    const confirmUpdate = confirm('確定要更新符合條件的資料嗎？');
    if (!confirmUpdate) {
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/${table}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conditions, updates }),
      });
  
      if (response.ok) {
        alert('修改成功！');
        fetchData(table);
      } else {
        const errorData = await response.json();
        alert(`修改失敗：${errorData.message}`);
      }
    } catch (error) {
      console.error('修改資料失敗:', error);
      alert('無法修改資料，請檢查後端伺服器狀態！');
    }
}

// 刪除資料
async function deleteRecord(table, data) {
   // 構建條件
   const conditions = {};
   Object.entries(data).forEach(([key, value]) => {
     if (value) { // 只有非空條件才傳遞
       conditions[key] = value;
     }
   });
 
   if (Object.keys(conditions).length === 0) {
     alert('請提供至少一個刪除條件！');
     return;
   }

   // 確認刪除操作
  const confirmDelete = confirm('確定要刪除符合條件的資料嗎？');
  if (!confirmDelete) {
    return;
  }
 
   try {
     const response = await fetch(`${API_BASE_URL}/${table}`, {
       method: 'DELETE',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(conditions),
     });
 
     if (response.ok) {
       alert('刪除成功！');
       fetchData(table);
     } else {
       const errorData = await response.json();
       alert(`刪除失敗：${errorData.message}`);
     }
   } catch (error) {
     console.error('刪除資料失敗:', error);
     alert('無法刪除資料，請檢查後端伺服器狀態！');
   }
}

// 移轉資料（僅針對靜止會員資料表）
async function transferRecord(table, data) {
  if (table !== 'inactive') return;
  const member_id = data['transfer_member_id'] || data['member_id']; // 支援不同表單欄位名稱
  if (!member_id) {
    alert('未提供會員身分證字號。');
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ member_id })
    });
    if (response.ok) {
      alert('移轉成功！');
      fetchData(table);
      fetchData('members');
    } else {
      const errorData = await response.json();
      alert(`移轉失敗：${errorData.message}`);
    }
  } catch (error) {
    console.error('移轉資料失敗:', error);
    alert('無法移轉資料，請檢查後端伺服器狀態！');
  }
}

// 查詢資料
async function selectRecord(table, data) {
  // 根據表格類型和查詢條件發送 GET 請求
  let query = '';
  Object.entries(data).forEach(([key, value]) => {
    if (value) { // 只有在有值的情況下才添加到查詢
      query += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
  });

  // 如果沒有條件，阻止查詢
  if (query === '') {
    alert('請提供至少一個查詢條件！');
    return [];
  }
  
  // 去掉最後的 &
  query = query.slice(0, -1);
  
  try {
    const response = await fetch(`${API_BASE_URL}/${table}?${query}`);
    if (response.ok) {
      const data = await response.json();
      renderTable(table, data);
      alert('查詢成功！');
      return data; // 返回查詢結果
    } else {
      const errorData = await response.json();
      alert(`查詢失敗：${errorData.message}`);
      return [];
    }
  } catch (error) {
    console.error('查詢資料失敗:', error);
    alert('無法查詢資料，請檢查後端伺服器狀態！');
    return [];
  }
}

// 列印資料（展示表格中的所有內容）
async function printTable(table) {
  try {
    const response = await fetch(`${API_BASE_URL}/${table}`);
    if (response.ok) {
      const data = await response.json();
      renderTable(table, data);
      alert('表格已展示所有內容！');
    } else {
      const errorData = await response.json();
      alert(`列印失敗：${errorData.message}`);
    }
  } catch (error) {
    console.error('列印資料失敗:', error);
    alert('無法列印資料，請檢查後端伺服器狀態！');
  }
}

// 打開修改或刪除的表單
function openEditDeleteForm(operation, table, rowData) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalForm = document.getElementById('modal-form');

  modalTitle.textContent = `${operation === 'edit' ? '修改' : '刪除'}資料`;
  modalForm.innerHTML = generateForm(table, operation);
  populateForm(table, rowData);
  modal.style.display = 'block';

  // **關鍵修正**：不要重置 pendingOperation 和 pendingTable
  // pendingOperation = null;
  // pendingTable = null;
}

// 獲取主鍵欄位名稱
function getKeyAttribute(table) {
  switch(table) {
    case 'fruits':
      return 'fruit_id';
    case 'members':
    case 'inactive':
      return 'member_id';
    case 'suppliers':
      return 'supplier_id';
    case 'transactions':
      return 'transaction_id'; // 假設有一個單一的主鍵
    default:
      return '';
  }
}
