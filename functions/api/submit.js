form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      form.reset();
    } else {
      alert('Error submitting form. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again later.');
  }
});
