// main.js

// Variabel Global untuk Progress Scroll (digunakan di three-setup.js)
window.scrollProgress = 0; 

document.addEventListener('DOMContentLoaded', () => {
    const detailSection = document.getElementById('details');
    const descriptionPoints = document.querySelectorAll('.description-point');
    const totalSteps = descriptionPoints.length;

    // Fungsi untuk menghitung progres scroll di bagian 'details'
    function calculateScrollProgress() {
        const rect = detailSection.getBoundingClientRect();
        const sectionHeight = detailSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Kapan mulai menghitung progres (ketika section masuk viewport)
        const startPoint = viewportHeight; 
        // Kapan selesai menghitung progres (ketika bagian akhir section keluar viewport)
        const endPoint = sectionHeight - viewportHeight; 

        // Jarak yang telah discroll di dalam area target
        const scrolledInArea = startPoint - rect.top; 

        // Hitung progres (0 hingga 1)
        let progress = scrolledInArea / endPoint;
        progress = Math.max(0, Math.min(1, progress));

        window.scrollProgress = progress; // Update variabel global

        // Logika untuk menampilkan deskripsi bertahap
        const stepProgress = 1 / totalSteps;
        descriptionPoints.forEach((point, index) => {
            const startThreshold = index * stepProgress;
            const endThreshold = (index + 1) * stepProgress;
            
            // Aktifkan elemen jika progres berada di antara threshold awal dan akhir
            if (progress >= startThreshold && progress < endThreshold) {
                point.classList.add('active');
            } else if (progress >= endThreshold) {
                // Biarkan tetap aktif setelah melewati
                point.classList.add('active'); 
            } else {
                point.classList.remove('active');
            }
        });
    }

    // Event listener untuk scroll
    window.addEventListener('scroll', calculateScrollProgress);
    window.addEventListener('load', calculateScrollProgress); // Cek saat load pertama kali
});
