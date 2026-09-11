import { KeystrokeTracker } from '../engine/KeystrokeTracker';
import { MetricsCalculator } from '../engine/MetricsCalculator';
import { MoodClassifier } from '../engine/MoodClassifier';
import { StorageService } from '../engine/StorageService';
import { ExtensionStorage } from './ExtensionStorage';
import { KeystrokeEvent } from '../types/typing';

const tracker = new KeystrokeTracker(8000);
const classifier = new MoodClassifier();

// Listen for messages from content scripts across any browser tab
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'TYPEMOOD_KEYSTROKE' && message.payload) {
    const event = message.payload as KeystrokeEvent;
    tracker.pushEvent(event);
    sendResponse({ status: 'ok' });
  } else if (message.type === 'OPEN_SIDEPANEL') {
    if (chrome.sidePanel && chrome.sidePanel.open && _sender.tab?.windowId) {
      chrome.sidePanel.open({ windowId: _sender.tab.windowId });
    }
  }
  return true;
});

// Periodic Evaluation Loop inside Service Worker
setInterval(async () => {
  const events = tracker.getEvents();
  const lastTs = tracker.getLastKeyTimestamp();
  const metrics = MetricsCalculator.calculate(events, lastTs, 8000);

  const state = await ExtensionStorage.getState();
  const nextMood = classifier.update(metrics, state.settings.sensitivity);
  const calmMs = classifier.getCalmDurationMs();

  // Save to Chrome Storage
  await ExtensionStorage.setState({
    currentMood: nextMood,
    metrics,
    calmDurationMs: calmMs,
  });

  // Log tick to history
  if (metrics.totalKeysInWindow > 0 || nextMood !== 'IDLE') {
    StorageService.recordMoodTick(nextMood, events.length > 0 ? 1 : 0, metrics.wpm);
  }

  // Broadcast update to content scripts across all tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'MOOD_UPDATE',
          mood: nextMood,
          metrics,
        }).catch(() => {});
      }
    });
  });
}, 800);

console.log('TypeMood Extension Service Worker Running!');
