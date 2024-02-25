import browser from 'webextension-polyfill';

const form = document.querySelector<HTMLFormElement>("#address")

async function saveConnectionDetails() {
  if (!form) {
    console.error("Extension not properly initialised")
  } else {
    const formData = new FormData(form);

    await browser.storage.local.set({
      AO3_ip: formData.get("ip"),
      AO3_port: formData.get("port")
    });
  }
}

// Take over form submission
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveConnectionDetails();
});

async function restoreConnectionDetails() {
    let res = await browser.storage.local.get();
    const ipInput = document.querySelector<HTMLInputElement>("#ip")
    ipInput ? ipInput.value = res.AO3_ip || '' : undefined
    const portInput = document.querySelector<HTMLInputElement>("#port")
    portInput ? portInput.value = res.AO3_port || '' : undefined
}

document.addEventListener('DOMContentLoaded', restoreConnectionDetails);