const API_BASE_URL = 'http://localhost:8080/api'; // 後端 API 的基礎網址
// Log in
// 預設的帳密
// const accounts = [
//     { username: "123", password: "123" },
//     { username: "456", password: "456" },
//     { username: "789", password: "789" }
// ];

// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const username = document.getElementById('username').value.trim();
//     const password = document.getElementById('password').value.trim();

//     // const user = accounts.find(acc => acc.username === username && acc.password === password);
//     data = {
//         'username': username,
//         'password': password,
//     }
//     if (user) {
//         alert("登入成功！");
//         window.location.href = "employee_private.html"; // 假設登入後跳轉到工作儀表板頁面
//     } else {
//         document.getElementById('errorMessage').innerText = "帳號或密碼錯誤！";
//     }
// });

async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    data = {
        'username': username,
        'password': password,
    }
    try {
        localStorage.setItem('customer_username', username)
        localStorage.setItem('customer_password', password)
        // alert(0)
        const response = await fetch(`${API_BASE_URL}/employee/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
        // alert(1)
        const response_data = await response.json();
        // alert(2)
        if (response.ok) {
            alert('登入成功！');
            window.location.href = "employee_private.html";
        } else {
            alert('登入失敗！', response_data.error);
        } 
        
    }
    catch (error) {
        console.error('查詢資料失敗:', error);
        alert('查詢資料失敗:' + error);
    }
}



// Private
async function submitOrder() {
    const menber_id = document.getElementById("menber_id").value.trim();
    const fruit_id = document.getElementById("fruit_id").value.trim();
    const transaction_id = document.getElementById("order_id").value.trim();

    // const resultDiv = document.getElementById("result");

    // if (menber_id === "" || fruit_id === "" || order_id === "") {
    //     resultDiv.innerHTML = "資料輸入錯誤，請填寫所有欄位。";
    //     resultDiv.classList.add("error");
    //     resultDiv.classList.remove("success");
    //     return;
    // }

    // const idRegex = /^[A-Z][0-9]{9}$/;
    // if (!idRegex.test(menber_id)) {
    //     resultDiv.innerHTML = "會員身分證字號格式錯誤。";
    //     resultDiv.classList.add("error");
    //     resultDiv.classList.remove("success");
    //     return;
    // }

    // if (isNaN(fruit_id) || isNaN(order_id)) {
    //     resultDiv.innerHTML = "水果編號或訂單號碼應為數字。";
    //     resultDiv.classList.add("error");
    //     resultDiv.classList.remove("success");
    //     return;
    // }

    conditions = {
        "transaction_id": transaction_id,
        "menber_id": menber_id,
        "fruit_id": fruit_id
    }
    updates = {
        "actual_shipping_date": getTodayDate()
    }

    // 發送資料到後端進行比對
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conditions, updates }),
        });

        if (response.ok) {
            console.log('Success:', response_data.status);
            console.log('Messages:', response_data.messages);
            let new_orders = {};
            console.log('訂單已確認');
            orders = new_orders;
        } else {
            console.log('更新訂單失敗:', response_data.error);
            alert(`更新訂單失敗: ${response_data.error}`);
        }
    } catch (error) {
        console.error('更新訂單失敗:', error);
        alert(`更新訂單失敗: ${response_data.error}`);
    }
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}