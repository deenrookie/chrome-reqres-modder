if (chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['rules'], (result) => {
      if (result.rules) {
        // console.log("rules", result.rules);
        
        // 无条件使用 '*'，允许消息发送到任何窗口
        window.postMessage({
          type: 'REQRES_MODDER_RULES_INIT',
          rules: result.rules
        }, '*');
      }
    });
  }
  