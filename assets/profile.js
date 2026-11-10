(() => {
  const form = document.getElementById('profileForm');
  const progress = document.getElementById('progressBar');
  const inputs = [...form.querySelectorAll('input,select,textarea')];
  const updateProgress = () => {
    const completed = inputs.filter(i => i.type === 'checkbox' ? i.checked : i.value.trim()).length;
    progress.style.width = Math.max(8, Math.round((completed / inputs.length) * 100)) + '%';
  };
  inputs.forEach(input => input.addEventListener('input', updateProgress));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = [...form.querySelectorAll('input[name="interests"]:checked')].slice(0, 3).map(i => i.value);
    const profile = Object.fromEntries(new FormData(form).entries());
    profile.interests = selected.length ? selected : ['technology'];
    profile.createdAt = new Date().toISOString();
    localStorage.setItem(window.CAREER_PROFILE_KEY, JSON.stringify(profile));
    location.href = 'roadmap.html';
  });
  form.querySelectorAll('input[name="interests"]').forEach(box => box.addEventListener('change', () => {
    const selected = form.querySelectorAll('input[name="interests"]:checked');
    if (selected.length > 3) box.checked = false;
    updateProgress();
  }));
  updateProgress();
})();
