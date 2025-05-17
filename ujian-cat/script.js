let timer; // Timer for countdown
let totalTime = 10 * 60; // Total time in seconds (10 minutes)

document.getElementById("mulai-ujian").addEventListener("click", function () {
  // Show soal section
  document.getElementById("soal-section").style.display = "block";
  // Start timer
  startTimer();
  // Load soal from JSON
  tampilkanSoal();
});

// Function to start countdown timer
function startTimer() {
  timer = setInterval(function () {
    if (totalTime <= 0) {
      clearInterval(timer);
      alert("Waktu habis!");
      // Optionally, submit the form automatically
      document.getElementById("soalForm").submit();
    } else {
      totalTime--;
      const minutes = Math.floor(totalTime / 60);
      const seconds = totalTime % 60;
      document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  }, 1000);
}

// Function to display questions
function tampilkanSoal() {
  fetch("soal-cat.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("daftar-soal");

      data.soal.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("mb-3");

        const label = document.createElement("label");
        label.classList.add("form-label");
        label.textContent = `${index + 1}. ${item.pertanyaan}`;
        div.appendChild(label);

        const opsi = item.opsi;
        for (let kunci in opsi) {
          const pilihan = document.createElement("div");
          pilihan.innerHTML = `
            <input type="radio" name="soal${item.id}" value="${kunci}" required>
            ${kunci.toUpperCase()}. ${opsi[kunci]}
          `;
          div.appendChild(pilihan);
        }

        container.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Gagal memuat soal:", error);
    });
}

// Handle form submission to calculate score
document.getElementById("soalForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let score = 0;
  const formData = new FormData(event.target);
  fetch("soal-cat.json")
    .then((response) => response.json())
    .then((data) => {
      data.soal.forEach((item) => {
        const selectedAnswer = formData.get(`soal${item.id}`);
        if (selectedAnswer === item.jawaban) {
          score++;
        }
      });

      alert(`Skor Anda: ${score} dari ${data.soal.length}`);
    });
});