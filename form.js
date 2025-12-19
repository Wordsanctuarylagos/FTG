const scriptURL = "https://script.google.com/macros/s/AKfycbzhkGb4gwtD8SuQkxXhYnE5SfJN2zR74nfdcMaU2jLPOE_4QEV6uNRKNBMksakBH4wotw/exec";

/* ================= TOGGLE ================= */
document.getElementById("ftgBtn").onclick = () => {
  document.getElementById("ftgForm").style.display = "block";
  document.getElementById("officeForm").style.display = "none";
};

document.getElementById("officeBtn").onclick = () => {
  document.getElementById("passwordModal").style.display = "flex";
};

/* ================= OFFICE LOGIN ================= */
function loginOffice() {
  const password = document.getElementById("officePassword").value;
  const error = document.getElementById("passwordError");
  const spinner = document.getElementById("loginSpinner");
  const text = document.getElementById("loginText");
  const btn = document.getElementById("loginBtn");

  error.textContent = "";
  spinner.style.display = "inline-block";
  text.textContent = "Checking...";
  btn.disabled = true;

  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams({
      action: "loginOffice",
      password
    })
  })
    .then(res => res.json())
    .then(data => {
      spinner.style.display = "none";
      text.textContent = "Login";
      btn.disabled = false;

      if (!data.success) {
        error.textContent = "Incorrect password";
        return;
      }

      document.getElementById("passwordModal").style.display = "none";
      document.getElementById("ftgForm").style.display = "none";
      document.getElementById("officeForm").style.display = "block";
      document.getElementById("officePassword").value = "";

      fetchTodayNames();
    })
    .catch(() => {
      spinner.style.display = "none";
      text.textContent = "Login";
      btn.disabled = false;
      error.textContent = "Login failed";
    });
}

function closePasswordModal() {
  document.getElementById("passwordModal").style.display = "none";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("officePassword").value = "";
}

/* ================= FETCH NAMES ================= */
function fetchTodayNames() {
  fetch(`${scriptURL}?action=fetchNames`)
    .then(res => res.json())
    .then(names => {
      const select = document.getElementById("ftgNameSelect");
      select.innerHTML = '<option value="">Select FTG Name</option>';
      names.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });
    });
}

/* ================= FTG SUBMIT ================= */
document.getElementById("formFTG").addEventListener("submit", function (e) {
  e.preventDefault();
  const success = document.getElementById("ftgSuccess");
  success.style.display = "none";

  const formData = new FormData(this);
  formData.append("action", "addFTG");

  fetch(scriptURL, { method: "POST", body: formData })
    .then(res => res.json())
    .then(() => {
      this.reset();
      success.textContent = "FTG data submitted successfully";
      success.style.display = "block";
      setTimeout(() => success.style.display = "none", 4000);
    });
});

/* ================= OFFICE SUBMIT ================= */
document.getElementById("formOffice").addEventListener("submit", function (e) {
  e.preventDefault();
  const success = document.getElementById("officeSuccess");
  success.style.display = "none";

  const formData = new FormData(this);
  formData.append("action", "updateOffice");

  fetch(scriptURL, { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      if (!data.success) return;
      this.reset();
      success.textContent = "Office data updated successfully";
      success.style.display = "block";
      setTimeout(() => success.style.display = "none", 4000);
    });
});
