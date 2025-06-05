// === TOGGLE FORM DISPLAY ===
document.getElementById('ftgBtn').onclick = () => {
  document.getElementById('ftgForm').style.display = 'block';
  document.getElementById('officeForm').style.display = 'none';
};

document.getElementById('officeBtn').onclick = () => {
  document.getElementById('passwordModal').style.display = 'flex';
};

// === PASSWORD PROTECTION FOR OFFICE FORM ===
function checkPassword() {
  const password = document.getElementById('officePassword').value;
  const errorDisplay = document.getElementById('passwordError');

  if (password === 'WSLoffice') {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('ftgForm').style.display = 'none';
    document.getElementById('officeForm').style.display = 'block';
    errorDisplay.textContent = '';
    document.getElementById('officePassword').value = '';
    fetchNamesForToday();
  } else {
    errorDisplay.textContent = 'Incorrect password. Please try again.';
  }
}

function closePasswordModal() {
  document.getElementById('passwordModal').style.display = 'none';
  document.getElementById('officePassword').value = '';
  document.getElementById('passwordError').textContent = '';
}

// === REPLACE THESE LINKS WITH YOUR DEPLOYED SCRIPT URLs ===
const ftgURL = 'https://script.google.com/macros/s/AKfycbye1QcCsiYMzUKnrqEtuzmea65sT7E4nT67F3lenp27pzO_Bp8lj_AWMpy0k7Qzt57B/exec';
const officeURL = 'https://script.google.com/macros/s/AKfycbzZVc17kEyytMKv_4Jx_6KUYb4AhR6BdvNJD2pU6WjReS3jr4NUO6cwsohTX3-eyXjEyA/exec';
const fetchNamesURL = 'https://script.google.com/macros/s/AKfycbxGHlj5XYk7zrNrp5G8cKKExhkEHnwC3f-tKBwMWhBjUgFoHV6IlDg7NYg1Vhh8xckVIQ/exec';

// === FETCH TODAY'S NAMES FOR OFFICE FORM SELECT BOX ===
function fetchNamesForToday() {
  fetch(fetchNamesURL)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('ftgNameSelect');
      select.innerHTML = '<option value="">Select FTG Name</option>';
      data.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Failed to fetch names', err);
    });
}

// === FTG FORM SUBMIT ===
document.getElementById('formFTG').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(ftgURL, {
    method: 'POST',
    body: new FormData(this)
  }).then(res => {
    alert('FTG Data Submitted');
    this.reset();
  }).catch(err => {
    console.error(err);
    alert('Error submitting FTG data');
  });
});

// === OFFICE FORM SUBMIT ===
document.getElementById('formOffice').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(officeURL, {
    method: 'POST',
    body: new FormData(this)
  }).then(res => {
    alert('Office Use Data Submitted');
    this.reset();
  }).catch(err => {
    console.error(err);
    alert('Error submitting Office Use data');
  });
});
