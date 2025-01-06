// عرض واجهة إنشاء حساب جديد
function showRegister() {
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
}

// عرض واجهة تسجيل الدخول
function showLogin() {
    document.querySelector('.login-container').style.display = 'block';
    document.getElementById('register-container').style.display = 'none';
}

// إنشاء حساب جديد
function register() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    if (username && password && password.length >= 8) {
        localStorage.setItem(username, password);
        alert('تم إنشاء الحساب بنجاح!');
        showLogin();
    } else {
        alert('الرجاء إدخال اسم مستخدم وكلمة مرور صحيحة (8 أحرف أو أرقام).');
    }
}

// تسجيل الدخول
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const storedPassword = localStorage.getItem(username);

    if (storedPassword === password) {
        localStorage.setItem('currentUser', username);
        window.location.href = 'main.html'; // الانتقال للصفحة الرئيسية
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
}

// التحقق من تسجيل الدخول في الصفحة الرئيسية
if (window.location.pathname.includes('main.html')) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html'; // إعادة التوجيه لصفحة تسجيل الدخول
    }
}

// بيانات المستخدم
let currentUser = localStorage.getItem('currentUser');
let userData = JSON.parse(localStorage.getItem(currentUser + '_data')) || [];

// حساب الإجمالي أوتوماتيكي
document.getElementById('price').addEventListener('input', calculateTotal);
document.getElementById('quantity').addEventListener('input', calculateTotal);

function calculateTotal() {
    const price = parseFloat(document.getElementById('price').value) || 0;
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const total = price * quantity;
    document.getElementById('total').value = total.toFixed(2);
}

// إضافة بيانات جديدة
function addData() {
    const itemName = document.getElementById('itemName').value;
    const itemCode = document.getElementById('itemCode').value;
    const supplierName = document.getElementById('supplierName').value;
    const supplierCode = document.getElementById('supplierCode').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unit = document.getElementById('unit').value;
    const total = parseFloat(document.getElementById('total').value);

    if (itemName && itemCode && supplierName && supplierCode && purchaseDate && price && quantity && unit) {
        const newData = {
            itemName,
            itemCode,
            supplierName,
            supplierCode,
            purchaseDate,
            price,
            quantity,
            unit,
            total
        };

        userData.push(newData);
        localStorage.setItem(currentUser + '_data', JSON.stringify(userData));
        displayData();
        clearFields();
    } else {
        alert('الرجاء ملء جميع الحقول.');
    }
}

// عرض البيانات في الجدول
function displayData(data = userData) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.itemName}</td>
                <td>${item.itemCode}</td>
                <td>${item.supplierName}</td>
                <td>${item.supplierCode}</td>
                <td>${item.purchaseDate}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${item.total.toFixed(2)}</td>
                <td class="actions">
                    <button class="edit" onclick="editData(${index})">تعديل</button>
                    <button class="delete" onclick="deleteData(${index})">حذف</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// مسح الحقول
function clearFields() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemCode').value = '';
    document.getElementById('supplierName').value = '';
    document.getElementById('supplierCode').value = '';
    document.getElementById('purchaseDate').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('unit').value = 'كيلو';
    document.getElementById('total').value = '';
}

// البحث في البيانات
function searchData() {
    const searchItem = document.getElementById('searchItem').value.toLowerCase();
    const searchSupplier = document.getElementById('searchSupplier').value.toLowerCase();
    const date = document.getElementById('searchDate').value;

    const filteredData = userData.filter(item =>
        (searchItem === '' || item.itemName.toLowerCase().includes(searchItem) || item.itemCode.toLowerCase().includes(searchItem)) &&
        (searchSupplier === '' || item.supplierName.toLowerCase().includes(searchSupplier) || item.supplierCode.toLowerCase().includes(searchSupplier)) &&
        (date === '' || item.purchaseDate.includes(date))
    );
    displayData(filteredData);
}

// تعديل البيانات
function editData(index) {
    const item = userData[index];
    document.getElementById('itemName').value = item.itemName;
    document.getElementById('itemCode').value = item.itemCode;
    document.getElementById('supplierName').value = item.supplierName;
    document.getElementById('supplierCode').value = item.supplierCode;
    document.getElementById('purchaseDate').value = item.purchaseDate;
    document.getElementById('price').value = item.price;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('unit').value = item.unit;
    document.getElementById('total').value = item.total;

    // حذف البيانات القديمة
    userData.splice(index, 1);
    localStorage.setItem(currentUser + '_data', JSON.stringify(userData));
    displayData();
}

// حذف البيانات
function deleteData(index) {
    if (confirm('هل أنت متأكد من حذف هذه البيانات؟')) {
        userData.splice(index, 1);
        localStorage.setItem(currentUser + '_data', JSON.stringify(userData));
        displayData();
    }
}

// عرض البيانات عند تحميل الصفحة
displayData();
