const form = document.querySelector("#address");

async function saveConnectionDetails() {
  const formData = new FormData(form);

  await browser.storage.local.set({
    AO3_ip: formData.get("ip"),
    AO3_port: formData.get("port"),
    AO3_fandom: formData.get("fandom")
  });
}

// Take over form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveConnectionDetails();
});

async function restoreConnectionDetails() {
    let res = await browser.storage.local.get();
    document.querySelector("#ip").value = res.AO3_ip || ''
    document.querySelector("#port").value = res.AO3_port || ''
    document.querySelector("#fandom").value = res.AO3_fandom || ''
}

document.addEventListener('DOMContentLoaded', restoreConnectionDetails);