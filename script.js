import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal@latest/+esm";

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loader-text');
const resultContainer = document.getElementById('result-container');
const originalPreview = document.getElementById('original-preview');
const resultPreview = document.getElementById('result-preview');
const downloadBtn = document.getElementById('download-btn');

// Обработка клика и перетаскивания файлов
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-blue-500', 'bg-slate-800');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-blue-500', 'bg-slate-800');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-500', 'bg-slate-800');
    if (e.dataTransfer.files.length > 0) {
        handleImage(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImage(e.target.files[0]);
    }
});

// Основная функция удаления фона
async function handleImage(file) {
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения.');
        return;
    }

    // Показываем оригинал
    const imageUrl = URL.createObjectURL(file);
    originalPreview.src = imageUrl;

    // Переключаем интерфейс (скрываем зону загрузки, показываем лоадер)
    dropZone.classList.add('hidden');
    resultContainer.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        loaderText.textContent = 'Загрузка ИИ-модели и анализ...';
        
        // Удаляем фон с помощью библиотеки @imgly/background-removal
        const blob = await removeBackground(file, {
            progress: (key, current, total) => {
                if (total) {
                    const percent = Math.round((current / total) * 100);
                    loaderText.textContent = `Обработка: ${percent}%`;
                }
            }
        });

        // Создаем ссылку на результат
        const resultImageUrl = URL.createObjectURL(blob);
        resultPreview.src = resultImageUrl;
        
        // Настраиваем кнопку скачивания
        downloadBtn.href = resultImageUrl;
        downloadBtn.download = `no-bg-${file.name.replace(/\.[^/.]+$/, "")}.png`;

        // Показываем блок с результатами
        loader.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        dropZone.classList.remove('hidden'); // Возвращаем зону для новых картинок

    } catch (error) {
        console.error(error);
        alert('Произошла ошибка при обработке изображения.');
        loader.classList.add('hidden');
        dropZone.classList.remove('hidden');
    }
}
