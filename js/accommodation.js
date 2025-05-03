// accommodation.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('accommodation.js loaded');
    
    const form   = document.querySelector('#accom-form');
    if (!form) return console.error('Form #accom-form not found!');
    
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');
  
    // Build the JSON payload from form fields
    function getJsonBody() {
      const body = {
        user_id:          Number(localStorage.getItem('user_id')),
        title:            form.elements['title'].value.trim(),
        type:             form.elements['type'].value,
        address:          form.elements['address'].value.trim(),
        price:            parseFloat(form.elements['price'].value) || 0,
        parking:          form.elements['parking'].checked ? 1 : 0,
        wifi:             form.elements['wifi'].checked ? 1 : 0,
        air_conditioning: form.elements['air_conditioning'].checked ? 1 : 0,
        balcony:          form.elements['balcony'].checked ? 1 : 0,
        reservation_mode: form.elements['reservation_mode'].value,
        description:      form.elements['description'].value.trim()
      };
      console.log('Payload:', body);
      return body;
    }
  
    // If editing, fetch existing data and populate
    async function populateForm() {
      if (!id) return;
      const url = `../../DZHouse/php/accommodations.php?id=${id}`;
      console.log('Fetch existing accommodation from', url);
      try {
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('Existing data:', data);
        form.elements['title'].value               = data.title;
        form.elements['type'].value                = data.type;
        form.elements['address'].value             = data.address;
        form.elements['price'].value               = data.price;
        form.elements['parking'].checked           = Boolean(data.parking);
        form.elements['wifi'].checked              = Boolean(data.wifi);
        form.elements['air_conditioning'].checked  = Boolean(data.air_conditioning);
        form.elements['balcony'].checked           = Boolean(data.balcony);
        form.elements['reservation_mode'].value    = data.reservation_mode;
        form.elements['description'].value         = data.description || '';
      } catch (err) {
        console.error('populateForm error:', err);
        alert('Failed to load accommodation data.');
      }
    }
  
    // Handle form submit (create or update)
    form.addEventListener('submit', async e => {
      e.preventDefault();  // MUST be first!
      console.log('Form submit intercepted');
  
      const payload = getJsonBody();
      const url     = id
        ? `../../DZHouse/php/accommodations.php?id=${id}`
        : `../../DZHouse/php/accommodations.php`;
      const method  = id ? 'PUT' : 'POST';
  
      console.log(`Sending ${method} to ${url}`);
      try {
        const res  = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        });
        console.log('Raw response:', res);
        const json = await res.json();
        console.log('Parsed JSON:', json);
  
        if (!res.ok) {
          alert(`Error: ${json.error || 'Operation failed'}`);
          return;
        }
        const newId = id || json.ID;
        alert('Success!');
        // you can redirect here if needed:
        // window.location.href = `details.html?id=${newId}`;
      } catch (err) {
        console.error('Fetch error:', err);
        alert('Network error—please try again.');
      }
    });
  
    populateForm();
  });
  