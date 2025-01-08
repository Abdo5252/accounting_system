const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// تجاهل تحذيرات DeprecationWarning
process.removeAllListeners('warning');

// تهيئة Firebase
const serviceAccount = require('C:/Users/Abdelrhman/Desktop/accounting-system/backend/accounting-system-2526b-firebase-adminsdk-iqie1-814479f567.json'); // المسار لملف الـ JSON
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://accounting-system-2526b.firebaseio.com" // رابط قاعدة البيانات
});

const db = admin.database();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes

// 1. تسجيل الدخول
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const userRef = db.ref('users/' + username);
  userRef.once('value', (snapshot) => {
    const user = snapshot.val();
    if (user && user.password === password) {
      res.status(200).json({ message: 'تم تسجيل الدخول بنجاح!', username });
    } else {
      res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }
  });
});

// 2. إنشاء حساب جديد
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (username && password && password.length >= 8) {
    const userRef = db.ref('users/' + username);
    userRef.set({ password })
      .then(() => {
        res.status(201).json({ message: 'تم إنشاء الحساب بنجاح!' });
      })
      .catch((error) => {
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب.', error });
      });
  } else {
    res.status(400).json({ message: 'الرجاء إدخال اسم مستخدم وكلمة مرور صحيحة (8 أحرف أو أرقام).' });
  }
});

// 3. إضافة بيانات جديدة
app.post('/add-data', (req, res) => {
  const { username, itemName, itemCode, supplierName, supplierCode, purchaseDate, price, quantity, unit, total } = req.body;

  if (username && itemName && itemCode && supplierName && supplierCode && purchaseDate && price && quantity && unit) {
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

    const dataRef = db.ref('invoices/' + username);
    dataRef.push(newData)
      .then(() => {
        res.status(201).json({ message: 'تم إضافة البيانات بنجاح!' });
      })
      .catch((error) => {
        res.status(500).json({ message: 'حدث خطأ أثناء إضافة البيانات.', error });
      });
  } else {
    res.status(400).json({ message: 'الرجاء ملء جميع الحقول.' });
  }
});

// 4. عرض البيانات
app.get('/get-data/:username', (req, res) => {
  const { username } = req.params;

  const dataRef = db.ref('invoices/' + username);
  dataRef.once('value', (snapshot) => {
    const data = snapshot.val();
    res.status(200).json(data);
  });
});

// 5. تعديل البيانات
app.put('/update-data/:username/:key', (req, res) => {
  const { username, key } = req.params;
  const { itemName, itemCode, supplierName, supplierCode, purchaseDate, price, quantity, unit, total } = req.body;

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

    const dataRef = db.ref('invoices/' + username + '/' + key);
    dataRef.update(updatedData)
      .then(() => {
        res.status(200).json({ message: 'تم تحديث البيانات بنجاح!' });
      })
      .catch((error) => {
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث البيانات.', error });
      });
  } else {
    res.status(400).json({ message: 'الرجاء ملء جميع الحقول.' });
  }
});

// 6. حذف البيانات
app.delete('/delete-data/:username/:key', (req, res) => {
  const { username, key } = req.params;

  const dataRef = db.ref('invoices/' + username + '/' + key);
  dataRef.remove()
    .then(() => {
      res.status(200).json({ message: 'تم حذف البيانات بنجاح!' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'حدث خطأ أثناء حذف البيانات.', error });
    });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`السيرفر شغال على البورت ${PORT}`);
});