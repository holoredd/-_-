// Immediately invoked function expression
// to not pollute the global scope
(function() {
  const wheel = document.querySelector('.wheel');
  const startButton = document.querySelector('button');
  let deg = 0;

  // --- Ссылки на элементы модального окна (если они есть в DOM) ---
  const resultModal = document.getElementById('resultModal');
  const resultText = document.getElementById('resultText');
  const resultImage = document.getElementById('resultImage');
  const resultLink = document.getElementById('resultLink');

  startButton.addEventListener('click', () => {
    // Disable button during spin
    startButton.style.pointerEvents = 'none';
    // Calculate a new rotation between 5000 and 10 000
    deg = Math.floor(3000 + Math.random() * 3000); //  -- количество градусов --
    // Set the transition on the wheel
    wheel.style.transition = 'all 6s ease-out';
    // Rotate the wheel
    wheel.style.transform = `rotate(${deg}deg)`;
    // Apply the blur
    wheel.classList.add('blur');
  });

  wheel.addEventListener('transitionend', () => {
    // Remove blur
    wheel.classList.remove('blur');
    // Enable button when spin is over
    startButton.style.pointerEvents = 'auto';
    // Need to set transition to none as we want to rotate instantly
    wheel.style.transition = 'none';
    // Calculate degree on a 360 degree basis to get the "natural" real rotation
    // Important because we want to start the next spin from that one
    // Use modulus to get the rest value from 360
    const actualDeg = deg % 360;
    // Set the real rotation instantly without animation
    wheel.style.transform = `rotate(${actualDeg}deg)`;

    // --- Минимальный блок: вычислить сектор, взять приз и показать модал ---
    // Параметры для расчёта сектора
    const sectorCount = 8;
    const sectorAngle = 360 / sectorCount; // 45°
    const sectorOffset = 0; // при необходимости подкорректируйте (в градусах)

    // pointerAngle — угол относительно указателя сверху
    const pointerAngle = (360 - actualDeg + sectorOffset) % 360;

    // вычисляем индекс сектора (0..7)
    const index = Math.floor((pointerAngle + sectorAngle / 2) / sectorAngle) % sectorCount;

    // порядок призов должен соответствовать расположению секторов на картинке (начиная с того сектора,
    // который при rotation=0 находится под маркером, далее по часовой)
    const prizes = ['$100','$200','$300','$400','$500','$600','$700','$800'];
    const prize = prizes[index];

    // Заполнить содержимое модала (минимально)
    if (resultText) resultText.textContent = `You won ${prize}!`;
    if (resultLink) resultLink.href = '#';
    // (resultImage оставляем на ваше усмотрение; если хотите менять картинку под сектор,
    // можно присвоить resultImage.src = '...' здесь)

    // Показать модал (если он есть)
setTimeout(() => {
  resultModal.hidden = false;
  resultModal.setAttribute('aria-hidden', 'false');
  if (resultLink && typeof resultLink.focus === 'function') resultLink.focus();
}, 600); 
  });

  // (Опционально) минимальная логика скрытия модала при наличии кнопки закрытия с id="closeModal"
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn && resultModal) {
    closeBtn.addEventListener('click', () => {
      resultModal.hidden = true;
      resultModal.setAttribute('aria-hidden', 'true');
      if (typeof startButton.focus === 'function') startButton.focus();
    });
  }

})();
