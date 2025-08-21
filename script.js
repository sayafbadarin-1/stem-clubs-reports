// تفعيل الوضع الليلي
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// إعداد الخريطة
const map = L.map("map").setView([31.95, 35.2], 8); // وسط فلسطين
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// إضافة أزرار تكبير/تصغير
L.control.zoom({
  position: 'bottomright'
}).addTo(map);

let marker;
map.on("click", function(e) {
  if (marker) map.removeLayer(marker);
  marker = L.marker(e.latlng).addTo(map);
});

// زر "استخدم موقعي"
document.getElementById("locateBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 15);
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);
    });
  } else {
    alert("المتصفح لا يدعم تحديد الموقع.");
  }
});

// إظهار حقل "أخرى"
const problemType = document.getElementById("problemType");
const otherProblemContainer = document.getElementById("otherProblemContainer");

problemType.addEventListener("change", function() {
  if (this.value === "أخرى") {
    otherProblemContainer.style.display = "block";
  } else {
    otherProblemContainer.style.display = "none";
  }
});

// معاينة الصور
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", function() {
  imagePreview.innerHTML = "";
  Array.from(this.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// معالجة الإرسال
document.getElementById("reportForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("modal").style.display = "flex";
});

// إغلاق المودال
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});
