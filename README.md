# ReqRes Modder

**ReqRes Modder** is a powerful Chrome extension for intercepting and modifying HTTP **Requests** and **Responses**. It supports rule-based manipulation of request URLs, headers, bodies, and response contents — perfect for debugging, testing, or simulating backend behavior.


## ✨ Features

- Intercepts both `XMLHttpRequest` and `fetch` API calls
- Modify request method, URL, headers, or body
- Modify response status code, headers, or body
- You can write you own complex logic by editing interceptReq.js directly


## 🔧 Installation (Developer Mode)

You can install from Chrome Extension Shop: https://chromewebstore.google.com/detail/reqres-modder/chldhioickekglgaojooebkhfjjikeih

or if you want to write complex logic, can install from GitHub

1. Clone or download this repository:
   ```bash
   git clone https://github.com/deenrookie/chrome-reqres-modder.git
    ```

2. Open Chrome and go to chrome://extensions/

3. Enable "Developer mode" in the top-right corner

4. Click "Load unpacked" and select the root directory of this project

5. The extension should now be installed and ready to use


## 🚀 How to Write Complex Logic

Edit the interceptReq.js directly.

Modifying XMLHttpRequest and fetch code depends on frontend javascript.

Here is a example to change the response 


```javascript


// -------------------------------------
// edit flag to be true first
// example for custom logic, edit the response body value
// responseText will return text, response will return a JSON object or text
// -------------------------------------

if ("responseText" === s || ("response" === s && typeof t.response == 'string')) {
    let newResp = JSON.parse(t.responseText);
    if (newResp.website) {
        newResp.website = "test.com";
        return JSON.stringify(newResp);
    }
}
if ("response" === s && typeof t.response == 'object') {
    if (t.response.website) {
        t.response.website = "test.com"
        return t.response;
    }
}

// -------------------------------------



```


```javascript
// -------------------------------------
// example for custom logic, edit the response body value
// -------------------------------------

const requestUrl = e.url;
if (requestUrl === 'https://jsonplaceholder.typicode.com/users/1') {
    const oldResp = await o(e, r);
    const clonedResponse = oldResp.clone();
    const oldRespText = await clonedResponse.text();
    let modifiedBody = oldRespText;
    try {
        const respObject = JSON.parse(oldRespText);
        if (respObject.website) {
            respObject.website = "test.com";
        }
        modifiedBody = JSON.stringify(respObject);
    } catch (err) {
        // parse JSON error
    }
    const newResp = new Response(modifiedBody, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: clonedResponse.headers
    });

    return newResp;
}

// -------------------------------------



```