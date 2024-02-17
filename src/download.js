async function downloadUrl(AO3Url) {
    let res = await browser.storage.local.get();
    serverIp = `${res.AO3_ip}:${res.AO3_port}`
    
    download_button = document.getElementById("downloadAPIText")
    info_dropdown = document.getElementById("dropdownInfo")
    info_dropdown_text = document.getElementById("dropdownInfoText")
    
    download_button.text = "Downloading"
    
    let response
    try {
        response = await fetch(`http://${serverIp}/download`, {
          	method: "POST",
          	headers: {
            	'Content-Type': 'application/json'
          	},
          	body: JSON.stringify({
            	url: AO3Url
          	}),
        });
        console.log(await response);
    } catch (e) {
        console.error(e);
        download_button.text = "Failed"
        return
    }

    switch (response.status) {
        case 503:
            response_text = await response.text()
            download_button.text = "Failed"
            info_dropdown_text.innerText = response_text
            info_dropdown.classList.remove("hidden")
            break;
        default:
            download_button.text = "Success"
            break;
    }
}

if (!document.URL.includes("search")) {
    console.log("Adding API download button")
    navigationButtons = document.getElementsByClassName("work navigation actions")[0]
    const newButton = document.createElement("li")
    const newButtonText = document.createElement("a")
    const newButtonDropdown = document.createElement("ul")
    const newButtonDropdownInfo = document.createElement("li")
    const newButtonDropdownInfoText = document.createElement("a")

    newButtonText.text = "A2O4"
    newButtonText.id = "downloadAPIText"

    newButtonDropdown.className = "expandable secondary hidden"
    newButtonDropdown.id = "dropdownInfo"
    newButtonDropdown.style.marginTop = "36px"
    
    newButtonDropdownInfoText.id = "dropdownInfoText"
    newButtonDropdownInfoText.style.background = "none"
    newButtonDropdownInfoText.style.border = "none"

    newButtonDropdownInfo.appendChild(newButtonDropdownInfoText)
    newButtonDropdown.appendChild(newButtonDropdownInfo)
    newButton.appendChild(newButtonText)
    //newButton.appendChild(document.createTextNode("\u00a0"))
    newButton.appendChild(newButtonDropdown)
    newButton.addEventListener("click", (event) => downloadUrl(document.URL))
    navigationButtons.appendChild(newButton)
} else {
    console.log("Wrong Page")
}

