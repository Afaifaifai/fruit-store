const API_BASE_URL = 'http://localhost:8080/api'; // 後端 API 的基礎網址

// 切換顯示登入和創建帳號介面
function showLogin() {
    document.getElementById('login-container').classList.add('active');
    document.getElementById('create-account-container').classList.remove('active');
}

function showCreateAccount() {
    document.getElementById('create-account-container').classList.add('active');
    document.getElementById('login-container').classList.remove('active');
}

// 創建帳號功能
let accounts = {}; // 模擬帳號資料庫
function createAccount() {
    const username = document.getElementById('create-username').value.trim();
    const password = document.getElementById('create-password').value.trim();
    const member_id = document.getElementById('create-id').value.trim();
    const member_name = document.getElementById('create-name').value.trim();
    const email = document.getElementById('create-email').value.trim();
    const phone_number = document.getElementById('create-phone').value.trim();
    const mobile_number = document.getElementById('create-mobile').value.trim();
    const joined_line = document.querySelector('input[name="joined-line"]:checked')?.value || '不是';
    const address = document.getElementById('create-address').value.trim();
    const age = document.getElementById('create-age').value.trim();


    // 檢查必填欄位
    if (!username || !password || !member_id || !member_name || !email) {
        alert('帳號、密碼、身份證字號、姓名和 Email 為必填欄位');
        return;
    }

    data = {
        "member_id": member_id,
        "member_name": member_name,
        "phone_number": phone_number,
        "mobile_number": mobile_number,
        "email": email,
        "joined_line": joined_line,
        "address": address,
        "age": age,
        "username": username,
        "password": password
    }
    // 檢查身份證字號格式
    // const idRegex = /^[A-Z][0-9]{9}$/; // 第一位為大寫英文字母，後九位為數字
    // if (!idRegex.test(id)) {
    //     alert('身份證字號格式不正確，第一位必須是大寫英文字母，後九位為數字');
    //     return;
    // }

    // if (accounts[username]) {
    //     alert('帳號已存在');
    //     return;
    // }

    // 檢查是否選擇照片（選填時可省略此檢查）
    // const photo = document.getElementById('create-photo').files[0];
    // const reader = new FileReader();
    const photo_input = document.getElementById('create-photo');
    if (photo_input && photo_input.files.length > 0) {
        const file = photo_input.files[0];
        const reader = new FileReader();
        reader.onloadend = function() {
            data['photo'] = reader.result; // 將圖片轉換為 Base64
            create_user(data);
        };
        reader.readAsDataURL(file);
    }
    else {
        data['photo'] = '';
        create_user(data)
    }

    // reader.onload = function () {
    //     // 儲存帳號資料
    //     accounts[username] = {
    //         password,
    //         id,
    //         name,
    //         email,
    //         phone: document.getElementById('create-phone').value.trim(),
    //         mobile: document.getElementById('create-mobile').value.trim(),
    //         address: document.getElementById('create-address').value.trim(),
    //         age: document.getElementById('create-age').value.trim(),
    //         lineOptIn: document.querySelector('input[name="line-opt-in"]:checked')?.value || 'no', // 預設為 "否"
    //         photo: reader.result || null, // 選填，可能為空
    //     };
    //     alert('帳號創建成功，請返回登入');
    //     showLogin();
    // };

    // if (photo) {
    //     reader.readAsDataURL(photo);
    // } else {
    //     reader.onload(); // 無照片時直接執行儲存
    // }
}

async function create_user(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/members/insert`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        const response_data = await response.json();

        if (response.ok) {
            console.log('Success:', response_data.status);
            console.log('Messages:', response_data.messages);
            alert('創建會員成功！');
            showLogin();
        } else {
            console.error('Error:', response_data.error);
            alert(`創建會員失敗: ${response_data.error}`);
        }
    }
    catch (error) {
        console.error('創建會員過程失敗:', error);
        alert('無法新增資料，請檢查後端伺服器狀態！' + error);
    }
}

// 登入功能
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const member_id = document.getElementById('login-id').value.trim();

    verify(member_id, username, password);
}

// 檢查帳號密碼與身份證字號
// function checkCredentials(username, password, id) {
//     return (
//         accounts[username] &&
//         accounts[username].password === password &&
//         accounts[username].id === id
//     );
// }


async function verify(member_id, username, password) {
    data = {
        'member_id': member_id
    }
    try {
        const response = await fetch(`${API_BASE_URL}/members/select`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        const response_data = await response.json();

        if (response.ok) {
            console.log('Success:', response_data.status);
            console.log('Messages:', response_data.messages);
        
            const messagesMapArray = [];
            if (response_data.messages && Array.isArray(response_data.messages)) {
                response_data.messages.forEach(message => {
                    const map = new Map(Object.entries(message));
                    messagesMapArray.push(map);
                });
            }
            console.log(messagesMapArray[0].get('username'));
            console.log(messagesMapArray[0].get('password'));
            if (messagesMapArray[0].get('username') === username && messagesMapArray[0].get('password') === password) {
                alert('登入成功！');
                window.location.href = "order_system.html";
            }
            else {
                alert('帳號或密碼錯誤');
            }

        } else {
            console.error('Error:', response_data.error);
            alert(`查無此用戶: ${response_data.error}`);
        }
    }
    catch (error) {
        console.error('查詢資料失敗:', error);
        alert('無法查詢資料，請檢查後端伺服器狀態！' + error);
    }
}