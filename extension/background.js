chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ adhEnabled: true });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  const data = await chrome.storage.local.get(["adhEnabled"]);
  const enabled = !(data.adhEnabled === false);
  const next = !enabled;

  await chrome.storage.local.set({ adhEnabled: next });

  chrome.tabs.sendMessage(tab.id, {
    type: "ADH_TOGGLE",
    enabled: next
  });
});
