document.addEventListener('DOMContentLoaded', () => {

  // --- 1. إعداد الخريطة ---
  const map = L.map('map', { zoomControl: true });
  let marker;

  function setMarker(latlng) {
    if (marker) {
      marker.remove();
    }
    marker = L.marker(latlng).addTo(map)
      .bindPopup('<b>الموقع المحدد</b>')
      .openPopup();
  }

  map.on('click', (e) => setMarker(e.latlng));

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        map.setView(userLocation, 13);
        setMarker(userLocation);
      },
      () => {
        map.setView([31.95, 35.2], 8); // فلسطين
      }
    );
  } else {
    map.setView([31.95, 35.2], 8);
  }


  // --- 2. زر الوضع الليلي ---
  const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
  toggleDarkModeBtn.onclick = function() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      toggleDarkModeBtn.textContent = "☀️";
    } else {
      toggleDarkModeBtn.textContent = "🌙";
    }
  };


  // --- 3. مودال الإرسال وتجربة المستخدم ---
  const form = document.getElementById("problemForm");
  const modal = document.getElementById("successModal");
  const closeModalBtn = document.getElementById("closeModal");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = "جاري الإرسال...";
    setTimeout(() => {
      modal.style.display = "flex";
    }, 1000);
  });

  closeModalBtn.addEventListener("click", function() {
    modal.style.display = "none";
    submitButton.disabled = false;
    submitButton.textContent = "📨 إرسال البلاغ";
    form.reset();
    imagePreview.innerHTML = '';
    uploadedFiles = [];
    problemType.dispatchEvent(new Event('change'));
  });


  // --- 4. معاينة الصور المرفوعة مع إمكانية الحذف ---
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");
  let uploadedFiles = [];

  imageInput.addEventListener("change", function() {
    const files = Array.from(this.files);
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        uploadedFiles.push(file);

        const reader = new FileReader();
        reader.onload = function(e) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('image-preview-item');
          const img = document.createElement("img");
          img.src = e.target.result;
          const removeBtn = document.createElement('button');
          removeBtn.classList.add('remove-image-btn');
          removeBtn.innerHTML = '&times;';
          removeBtn.type = 'button'; // لمنع إرسال النموذج
          removeBtn.onclick = () => {
            wrapper.remove();
            uploadedFiles = uploadedFiles.filter(f => f !== file);
          };

          wrapper.appendChild(img);
  wrapper.appendChild(removeBtn);
          imagePreview.appendChild(wrapper);
        }
        reader.readAsDataURL(file);
      }
    });
    this.value = '';
  });


  // --- 5. إظهار حقل "أخرى" بحركة ناعمة ---
  const problemType = document.getElementById("problemType");
  const otherProblemDiv = document.getElementById("otherProblemDiv");

  problemType.addEventListener("change", function() {
    if (this.value === "أخرى") {
      otherProblemDiv.classList.add('visible');
    } else {
      otherProblemDiv.classList.remove('visible');
    }
  });

});
