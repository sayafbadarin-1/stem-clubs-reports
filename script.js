document.addEventListener('DOMContentLoaded', () => {

  // 1. تخزين عناصر الصفحة في متغيرات لسهولة الوصول إليها
  const darkModeToggle = document.getElementById('darkModeToggle');
  const reportForm = document.getElementById('reportForm');
  const problemTypeSelect = document.getElementById('problemType');
  const otherProblemContainer = document.getElementById('otherProblemContainer');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const locateBtn = document.getElementById('locateBtn');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');

  // =================================
  // 2. إعداد الوضع الليلي (مع الحفظ)
  // =================================
  const sunIcon = '☀️';
  const moonIcon = '🌙';

  // التحقق من الوضع المحفوظ في ذاكرة المتصفح عند تحميل الصفحة
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    darkModeToggle.textContent = sunIcon;
  }

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
      darkModeToggle.textContent = sunIcon;
    } else {
      localStorage.setItem('theme', 'light');
      darkModeToggle.textContent = moonIcon;
    }
  });

  // =================================
  // 3. إعداد الخريطة (Leaflet)
  // =================================
  // إعداد الخريطة لتكون متمركزة على نابلس مع تقريب جيد
  const map = L.map('map').setView([32.2238, 35.2613], 14); 
  let marker;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // عند الضغط على أي مكان في الخريطة، يتم وضع علامة
  map.on('click', (e) => {
    if (marker) {
      map.removeLayer(marker); // إزالة العلامة القديمة
    }
    marker = L.marker(e.latlng).addTo(map);
  });

  // زر "تحديد موقعي الحالي"
  locateBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 16);
        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.marker([lat, lng]).addTo(map);
      },
      () => {
        alert('تعذر الوصول إلى موقعك. يرجى التأكد من تفعيل خدمات الموقع.');
      }
    );
  });

  // =================================
  // 4. منطق التحكم في حقول النموذج
  // =================================

  // إظهار حقل "مشكلة أخرى" عند الاختيار
  problemTypeSelect.addEventListener('change', () => {
    if (problemTypeSelect.value === 'أخرى') {
      otherProblemContainer.style.display = 'block';
    } else {
      otherProblemContainer.style.display = 'none';
    }
  });

  // معاينة الصور المختارة
  imageInput.addEventListener('change', () => {
    imagePreview.innerHTML = ''; // تفريغ المعاينة عند كل تغيير
    const files = imageInput.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

  // =================================
  // 5. معالجة إرسال النموذج وإظهار المودال
  // =================================
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault(); // منع الإرسال التلقائي للصفحة

    // التحقق من أن جميع الحقول المطلوبة مملوءة
    if (reportForm.checkValidity()) {
      // إذا كان النموذج صالحًا، أظهر رسالة النجاح
      modal.style.display = 'flex';
      
      // هنا يمكنك إضافة كود لإرسال البيانات إلى الخادم (server) لو أردت
      
    } else {
      // إذا كان النموذج غير صالح، أظهر رسائل الخطأ الافتراضية للمتصفح
      reportForm.reportValidity();
    }
  });

  // إغلاق المودال وإعادة تعيين النموذج
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    
    // إعادة تعيين كل شيء لوضعه الأصلي
    reportForm.reset();
    imagePreview.innerHTML = ''; // مسح الصور
    if (marker) {
      map.removeLayer(marker); // مسح العلامة من الخريطة
    }
    // إخفاء حقل "أخرى" إذا كان ظاهرًا
    otherProblemContainer.style.display = 'none';
  });

});
