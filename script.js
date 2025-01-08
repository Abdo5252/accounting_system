import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";

// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBGrXWZIIDnD4yx031-_gh2QbQNh6WdrKE",
    authDomain: "accounting-system-2526b.firebaseapp.com",
    databaseURL: "https://accounting-system-2526b-default-rtdb.firebaseio.com",
    projectId: "accounting-system-2526b",
    storageBucket: "accounting-system-2526b.firebasestorage.app",
    messagingSenderId: "334713604535",
    appId: "1:334713604535:web:6c121b85f41eff32998032"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// بيانات المستخدم
let currentUser = localStorage.getItem('currentUser');

// التحقق من تسجيل الدخول في الصفحة الرئيسية
if (!currentUser) {
    window.location.href = 'index.html'; // إعادة التوجيه لصفحة تسجيل الدخول
} else {
    displayData(); // عرض البيانات عند تحميل الصفحة
}

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

        // إضافة البيانات لقاعدة البيانات
        push(ref(database, 'invoices/' + currentUser), newData);
        alert('تم إضافة البيانات بنجاح!');
        clearFields();
    } else {
        alert('الرجاء ملء جميع الحقول.');
    }
}

// عرض البيانات في الجدول
function displayData() {
    const invoicesRef = ref(database, 'invoices/' + currentUser);
    onValue(invoicesRef, (snapshot) => {
        const data = snapshot.val();
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';

        for (let key in data) {
            const item = data[key];
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
                        <button class="edit" onclick="editData('${key}')">تعديل</button>
                        <button class="delete" onclick="deleteData('${key}')">حذف</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
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

    const invoicesRef = ref(database, 'invoices/' + currentUser);
    onValue(invoicesRef, (snapshot) => {
        const data = snapshot.val();
        const filteredData = [];

        for (let key in data) {
            const item = data[key];
            if (
                (searchItem === '' || item.itemName.toLowerCase().includes(searchItem) || item.itemCode.toLowerCase().includes(searchItem)) &&
                (searchSupplier === '' || item.supplierName.toLowerCase().includes(searchSupplier) || item.supplierCode.toLowerCase().includes(searchSupplier)) &&
                (date === '' || item.purchaseDate.includes(date))
            ) {
                filteredData.push({ ...item, key });
            }
        }

        displayFilteredData(filteredData);
    });
}

// عرض البيانات المفلترة
function displayFilteredData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    data.forEach((item) => {
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
                    <button class="edit" onclick="editData('${item.key}')">تعديل</button>
                    <button class="delete" onclick="deleteData('${item.key}')">حذف</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// تعديل البيانات
function editData(key) {
    const itemRef = ref(database, 'invoices/' + currentUser + '/' + key);
    onValue(itemRef, (snapshot) => {
        const item = snapshot.val();
        document.getElementById('itemName').value = item.itemName;
        document.getElementById('itemCode').value = item.itemCode;
        document.getElementById('supplierName').value = item.supplierName;
        document.getElementById('supplierCode').value = item.supplierCode;
        document.getElementById('purchaseDate').value = item.purchaseDate;
        document.getElementById('price').value = item.price;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('unit').value = item.unit;
        document.getElementById('total').value = item.total;

        // تغيير زر الحفظ لتحديث البيانات
        const saveButton = document.getElementById('saveButton');
        saveButton.textContent = 'تحديث';
        saveButton.onclick = () => updateData(key);
    });
}

// تحديث البيانات
function updateData(key) {
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
        const updatedData = {
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

        update(ref(database, 'invoices/' + currentUser + '/' + key), updatedData);
        alert('تم تحديث البيانات بنجاح!');
        clearFields();
        displayData();
    } else {
        alert('الرجاء ملء جميع الحقول.');
    }
}

// حذف البيانات
function deleteData(key) {
    if (confirm('هل أنت متأكد من حذف هذه البيانات؟')) {
        remove(ref(database, 'invoices/' + currentUser + '/' + key));
        alert('تم حذف البيانات بنجاح!');
        displayData();
    }
}
