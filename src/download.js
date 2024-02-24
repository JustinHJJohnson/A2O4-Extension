function showDropdown(buttonText, message) {
    download_button = document.getElementById("A2O4ButtonText")
    info_dropdown = document.getElementById("A2O4dropdown")
    info_dropdown_text = document.getElementById("A2O4dropdownInfo")

    download_button.text = buttonText
    info_dropdown_text.innerText = message
    info_dropdown.classList.remove("hidden")
}

async function downloadUrl(AO3Url) {
    const res = await browser.storage.local.get();
    const serverIp = `${res.AO3_ip}:${res.AO3_port}`

    if (res.AO3_ip == '' || res.AO3_ip == undefined) {
        showDropdown("Error", "Server IP is not set")
        return
    }
    else if (res.AO3_port == '' || res.AO3_port == undefined) {
        showDropdown("Error", "Server port is not set")
        return
    }
    else if (!/^\d+$/.test(res.AO3_port)) {
        showDropdown("Error", "Port entered is not valid")
        return
    }
    
    const download_button = document.getElementById("A2O4ButtonText")
    download_button.text = "Downloading"

    const info_dropdown = document.getElementById("A2O4dropdown")
    info_dropdown.classList.add("hidden")
    
    let response = {}
    const testing = false
    if (!testing) {
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
            console.error(e)

            if (e instanceof TypeError) {
                if (e.message.startsWith("NetworkError")) {
                    showDropdown("Error", "Cannot connect to server, check ip and server state")
                } else {
                    showDropdown("Error", e)
                }
            } else {
                showDropdown("Error", e)
            }
            return
        }
    } else {
        response.status = 503
        response.text = async () => {
            return "test error message"
        }
    }

    switch (response.status) {
        case 503:
            showDropdown("Failed", await response.text())
            break;
        default:
            showDropdown("Success", await response.text())
            break;
    }
}

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

if (!document.URL.includes("search")) {
    console.log("Adding API download button")

    removeElementsByClass("A2O4Button")

    const navigationButtons = document.getElementsByClassName("work navigation actions")[0]
    const newButton = document.createElement("li")
    const newButtonText = document.createElement("a")
    const newButtonDropdown = document.createElement("ul")
    const newButtonDropdownInfo = document.createElement("p")

    newButton.className = "A2O4Button"
    
    newButtonText.text = "A2O4"
    newButtonText.id = "A2O4ButtonText"

    newButtonDropdown.className = "expandable secondary hidden"
    newButtonDropdown.id = "A2O4dropdown"
    newButtonDropdown.style.marginTop = "36px"
    
    newButtonDropdownInfo.id = "A2O4dropdownInfo"
    newButtonDropdownInfo.style.display = "block"

    newButtonDropdown.appendChild(newButtonDropdownInfo)
    newButton.appendChild(newButtonText)
    newButton.appendChild(newButtonDropdown)
    newButton.addEventListener("click", (event) => downloadUrl(document.URL))
    navigationButtons.appendChild(newButton)
} else {
    console.log("Wrong Page")
}

