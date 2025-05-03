// subscription.js
document.addEventListener('DOMContentLoaded', () => {
    //window.location.href = 'home.html';

    const form = document.querySelector('.subscription-main form');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // collect values
      const role       = document.querySelector('input[name="role"]:checked').value;
      const firstName  = document.querySelector('input[placeholder="Name"]').value;
      const lastName   = document.querySelector('input[placeholder="Family name"]').value;
      const phone      = document.querySelector('input[placeholder="+213"], input[placeholder="Phone"]').value.trim();
      const email      = document.querySelector('input[placeholder="Email"]').value;
      const password   = document.querySelector('input[placeholder="Password"]').value;
      const address    = document.querySelector('input[placeholder="Address"]').value;
      const postalCode = document.querySelector('input[placeholder="Postal code"]').value;
      const rib        = document.querySelector('input[placeholder="RIB"]').value;
  
      // build payload
      const payload = {
        role,
        first_name:   firstName,
        last_name:    lastName,
        phone,
        email,
        password,
        address,
        postal_code:  postalCode,
        rib
        // NOTE: we're not uploading photos here; you'd handle them separately
      };
  
      try {
        const res = await fetch('../../DZHouse/php/users.php', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        });
  
        const json = await res.json();
  
        if (res.ok) {
        localStorage.setItem('user_id', json.ID);
        window.location.href = 'login.html';
          form.reset();
        } else {
          alert(`Error: ${json.error || 'Subscription failed'}`);
        }
      } catch (err) {
        console.error(err);
        alert('Network error — please try again later.');
      }
    });
  });
  