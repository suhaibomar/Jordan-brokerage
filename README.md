# منصة عقارات الأردن - دليل الإعداد والنشر

## 1. إنشاء حساب الأدمن

### الخطوة الأولى: إنشاء الأدمن
بعد نشر الموقع أو تشغيله محلياً، توجه إلى:
```
/setup
```

أدخل بيانات الأدمن:
- الاسم الكامل
- البريد الإلكتروني
- كلمة المرور (8 أحرف على الأقل)

هذه الصفحة متاحة مرة واحدة فقط قبل إنشاء أول أدمن.

### بديل: تحويل مستخدم عادي لأدمن عبر SQL
إذا سجلت حساب عادي وأردت تحويله لأدمن:

```sql
-- استبدل 'your-email@example.com' بالبريد الإلكتروني
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

نفذ هذا في Supabase Dashboard > SQL Editor.

---

## 2. تغيير معلومات الموقع

### معلومات التواصل (الهاتف، الواتساب، العنوان)
عدّل الملفات التالية:

**`components/layout/Footer.tsx`:**
```tsx
// غيّر رقم الهاتف
<a href="tel:+962791234567">+962 79 123 4567</a>

// غيّر الواتساب
<a href="https://wa.me/962791234567">WhatsApp</a>

// غيّر العنوان
عمّان، الأردن - شارع الملكة رانيا
```

**`components/layout/Header.tsx`:**
```tsx
// غيّر رقم الواتساب
<a href="https://wa.me/962791234567">
```

**`components/properties/PropertyContactForm.tsx`:**
```tsx
// غيّر رقم الواتساب الافتراضي
contactNumber={'+962791234567'}
```

**`app/contact/page.tsx`:**
```tsx
// غيّر كل معلومات التواصل
<a href="tel:+962791234567">+962 79 123 4567</a>
<a href="mailto:info@jordan-realestate.com">info@jordan-realestate.com</a>
<a href="https://wa.me/962791234567">WhatsApp</a>
```

### تغيير اسم وعنوان الموقع
**`app/layout.tsx`:**
```tsx
title: 'اسم موقعك | عقارات'
description: 'وصف موقعك'
```

**`lib/i18n.ts`:**
```tsx
// غيّر اسم المنصة في القاموس
home: 'الرئيسية'
// وغير الترجمات حسب الحاجة
```

---

## 3. رفع الموقع على استضافة

### الخيار 1: Netlify (موصى به)

1. ارفع الكود إلى GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

2. اذهب إلى [netlify.com](https://netlify.com) واربط حساب GitHub

3. اختر المستودع وانقر "Deploy"

4. أضف متغيرات البيئة في Netlify:
```
NEXT_PUBLIC_SUPABASE_URL=https://macjxayzgjgtnqrdwdtf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
SUPABASE_DB_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### الخيار 2: Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. اربط حساب GitHub واختر المستودع
3. أضف نفس متغيرات البيئة
4. انقر "Deploy"

### الخيار 3: استضافة تقليدية (VPS)

1. ثبّت Node.js 18+ و PostgreSQL
2. انسخ الكود للمخدم:
```bash
git clone https://github.com/username/repo.git
cd repo
npm install
npm run build
npm start
```

3. استخدم PM2 لتشغيل التطبيق:
```bash
npm install -g pm2
pm2 start npm --name "realestate" -- start
pm2 save
pm2 startup
```

4. استخدم Nginx كـ reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. إضافة صور العقارات

النظام يستخدم روابط خارجية للصور. خيارات التخزين:

### الخيار 1: Supabase Storage (موصى به)
1. في Supabase Dashboard > Storage
2. أنشئ bucket اسمه `properties`
3. اضبط السياسات للسماح بالقراءة العامة
4. ارفع الصور واحصل على الروابط

### الخيار 2: Cloudinary (مجاني)
1. سجل في [cloudinary.com](https://cloudinary.com)
2. ارفع الصور واحصل على الروابط
3. أضف الروابط في قاعدة البيانات

### إضافة الصور لعقار:
من لوحة التحكم > العقارات > اختر عقار > أضف الصور

أو عبر SQL:
```sql
INSERT INTO property_images (property_id, url, is_primary, display_order)
VALUES ('property-uuid', 'https://image-url.jpg', true, 0);
```

---

## 5. الميزات المتوفرة

- لوحة تحكم كاملة للأدمن
- إدارة العقارات (شقق، أراضي، مباني)
- نظام ملاك عقاري خاص (CRM)
- نظام عملاء
- نظام المواعيد والزيارات
- نظام الاستفسارات
- بحث متقدم بفلاتر متعددة
- دعم ثنائي اللغة (عربي/إنجليزي)
- دعم كامل للـ RTL
- الوضع الداكن
- WhatsApp integration
- SEO محسن
- تصميم متجاوب

---

## 6. الأمان

- Owner information محمي بالكامل (لا يظهر للزوار)
- RLS policies تحمي البيانات
- الأدمن فقط يمكنه إدارة البيانات
- تأكد من الحفاظ على SUPABASE_SERVICE_ROLE_KEY سري!

---

## الدعم الفني

للمساعدة أو الإبلاغ عن مشاكل:
- افتح issue في GitHub
- أو تواصل عبر الواتساب
