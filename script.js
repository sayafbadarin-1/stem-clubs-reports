// إعداد الخريطة على فلسطين
var map = L.map('map', { zoomControl: true }).setView([31.95, 35.2], 8); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var marker;
map.on('click', function(e) {
  if (marker) marker.remove();
  marker = L.marker(e.latlng).addTo(map);
});

// زر الوضع الليلي
document.getElementById("toggleDarkMode").onclick = function() {
  document.body.classList.toggle("dark-mode");
};

// مودال الإرسال
const form = document.getElementById("problemForm");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

form.addEventListener("submit", function(e){
  e.preventDefault();
  modal.style.display = "flex"; // عرض المودال
});

// إغلاق المودال
closeModal.addEventListener("click", function(){
  modal.style.display = "none";
});

// معاينة الصور المرفوعة
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", function() {
  imagePreview.innerHTML = "";
  const files = Array.from(this.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      imagePreview.appendChild(img);
    }
    reader.readAsDataURL(file);
  });
});

// إذا اختار "أخرى" يظهر حقل إضافي
const problemType = document.getElementById("problemType");
const otherProblemDiv = document.getElementById("otherProblemDiv");

problemType.addEventListener("change", function() {
  if (this.value === "أخرى") {
    otherProblemDiv.style.display = "block";
  } else {
    otherProblemDiv.style.display = "none";
  }
});