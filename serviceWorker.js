// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: 'index.html'
  });
});

// Update extension icon based on enabled state
function updateExtensionIcon(enabled) {
  const iconPrefix = enabled ? 'icon' : 'icon-disabled';
  chrome.action.setIcon({
    path: {
      "16": `resources/${iconPrefix}16.png`,
      "32": `resources/${iconPrefix}32.png`,
      "48": `resources/${iconPrefix}48.png`,
      "128": `resources/${iconPrefix}128.png`
    }
  });
}

function initContentScripts() {
  chrome.scripting.registerContentScripts([
    {
      id: "interceptReq",
      matches: ["http://*/*", "https://*/*"],
      js: ["interceptReq.js"],
      excludeMatches: ["https://chrome.google.com/webstore/*"],
      runAt: "document_start",
      persistAcrossSessions: true,
      world: "MAIN",
      allFrames: true
    }
  ]).then(() => {
    console.log("[interceptReq] registered");
    registerRules();
  }).catch(err => console.warn("[interceptReq] registration error", err));
}

function registerRules() {
  chrome.scripting.registerContentScripts([
    {
      id: "rulesInit",
      matches: ["http://*/*", "https://*/*"],
      excludeMatches: ["https://chrome.google.com/webstore/*"],
      js: ["rulesInit.js"],
      runAt: "document_start",
      persistAcrossSessions: true,
      allFrames: true
    }
  ]).then(() => {
    console.log("[rulesInit] registered");
  }).catch(err => console.warn("[rulesInit] registration error", err));
}

// 根据是否启用来注册或移除
function updateContentScriptsByStatus(enabled) {
  chrome.scripting.getRegisteredContentScripts().then((scripts) => {
    const registeredIds = scripts.map(s => s.id);

    if (enabled) {
      if (!registeredIds.includes("interceptReq")) {
        initContentScripts();
      }
    } else {
      const toRemove = ["interceptReq", "rulesInit"].filter(id => registeredIds.includes(id));
      if (toRemove.length > 0) {
        chrome.scripting.unregisterContentScripts({ ids: toRemove }, () => {
          console.log("[unregister] removed:", toRemove);
        });
      }
    }
  });
}

// 初始安装：设置默认值
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled'], (res) => {
    if (typeof res.enabled !== 'boolean') {
      chrome.storage.local.set({ enabled: true }, () => {
        updateContentScriptsByStatus(true);
        updateExtensionIcon(true);
      });
    } else {
      updateContentScriptsByStatus(res.enabled);
      updateExtensionIcon(res.enabled);
    }
  });
});

// ✅ 监听 storage 状态变化，自动切换注入逻辑
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && 'enabled' in changes) {
    const newValue = changes.enabled.newValue;
    // console.log(`[storage changed] enabled = ${newValue}`);
    updateContentScriptsByStatus(newValue);
    updateExtensionIcon(newValue);
  }
});
