# المرحلة الأولى: بناء التطبيق
FROM node:18-alpine
WORKDIR /app

# نسخ ملفات الإعدادات وتثبيت المكتبات
COPY package*.json ./
RUN npm install

# نسخ بقية ملفات المشروع وعمل بناء (Build)
COPY . .
RUN npm run build

# المرحلة الثانية: تشغيل التطبيق باستخدام خادم خفيف
RUN npm install -g serve
EXPOSE 3000

# أمر التشغيل النهائي
CMD ["serve", "-s", "dist", "-l", "3000"]