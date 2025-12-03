// استيراد الوحدات المطلوبة
const express = require('express');

// تهيئة تطبيق Express
const app = express();

// الحصول على المنفذ من متغيرات البيئة أو استخدام المنفذ الافتراضي 3000
const PORT = process.env.PORT || 3000;

// وسيط لتحليل محتوى JSON في الطلبات
app.use(express.json());

// نقطة فحص الصحة - تستخدم من قبل موازنات الأحمال والمنسقين
app.get('/ar/health', (req, res) => {
  res.status(200).json({
    status: 'سليم',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'التطبيق يعمل بنجاح'
  });
});

// نقطة النهاية الرئيسية - معلومات أساسية عن الواجهة البرمجية
app.get('/ar/', (req, res) => {
  res.status(200).json({
    message: 'مرحباً بك في تطبيق اختبار CI/CD',
    version: '1.0.0',
    language: 'العربية',
    endpoints: {
      health: '/health',
      data: '/api/data',
      status: '/api/status'
    }
  });
});

// نقطة البيانات - ترجع بيانات تجريبية للاختبار
app.get('/ar/api/data', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      items: [
        { id: 1, name: 'العنصر الأول', description: 'عنصر الاختبار الأول' },
        { id: 2, name: 'العنصر الثاني', description: 'عنصر الاختبار الثاني' },
        { id: 3, name: 'العنصر الثالث', description: 'عنصر الاختبار الثالث' }
      ],
      count: 3,
      timestamp: new Date().toISOString()
    }
  });
});

// نقطة الحالة - ترجع حالة التطبيق
app.get('/ar/api/status', (req, res) => {
  res.status(200).json({
    status: 'يعمل',
    environment: process.env.NODE_ENV || 'تطوير',
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' ميجابايت',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' ميجابايت'
    }
  });
});

// معالج 404 - التقاط جميع المسارات غير المطابقة
app.use((req, res) => {
  res.status(404).json({
    error: 'غير موجود',
    message: 'نقطة النهاية المطلوبة غير موجودة',
    path: req.path
  });
});

// وسيط معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error('خطأ:', err.message);
  res.status(500).json({
    error: 'خطأ داخلي في الخادم',
    message: err.message
  });
});

// بدء تشغيل الخادم
const server = app.listen(PORT, () => {
  console.log(`التطبيق العربي يعمل على المنفذ ${PORT}`);
  console.log(`البيئة: ${process.env.NODE_ENV || 'تطوير'}`);
  console.log(`فحص الصحة: http://localhost:${PORT}/health`);
});

// معالجة الإيقاف الآمن
process.on('SIGTERM', () => {
  console.log('تم استلام إشارة SIGTERM: جاري إغلاق خادم HTTP');
  server.close(() => {
    console.log('تم إغلاق خادم HTTP');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('تم استلام إشارة SIGINT: جاري إغلاق خادم HTTP');
  server.close(() => {
    console.log('تم إغلاق خادم HTTP');
    process.exit(0);
  });
});

// تصدير التطبيق لأغراض الاختبار
module.exports = app;