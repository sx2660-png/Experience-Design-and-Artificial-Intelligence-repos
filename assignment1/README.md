# Assignment1

A Pen created on CodePen.

Original URL: [https://codepen.io/sx2660-png/pen/XJKqgGz](https://codepen.io/sx2660-png/pen/XJKqgGz).
# 🧩 Retro Timeline Fixer (History Learning Game)

A classroom-friendly, game-based learning mini app:
students drag shuffled event cards into 6 timeline slots to “repair” a historical sequence.
After submitting, each slot is marked ✅ green (correct) or ❌ red (wrong), and optional AI feedback explains turning points and cause-and-effect.

## ✨ Features
- **Two decks (6 events each)**
  - Collapse of the Soviet Union (USSR)
  - WWI: From spark to full war
- **Drag-and-drop timeline**
  - Fixed 6 slots in a horizontal timeline
  - Visual correctness feedback (green/red)
- **Images on event cards**
  - Thumbnails are cropped to fit
  - Click to open full image in a new tab
- **AI Feedback (Gemini API)**
  - Encouraging, structured feedback
  - Highlights turning points + cause-and-effect chain
- **Retro UI**
  - Paper texture, typewriter vibe, “stamp” correctness labels

## 🎮 How to Play
1. Select a deck and click **Start**.
2. Drag cards from the **Card Bank** into the 6 timeline slots (left → right).
3. Click **Check Timeline** to score:
   - Green = correct slot
   - Red = wrong slot
4. (Optional) Click **AI Feedback** to see an explanation.

## 🧰 Setup
This is a pure front-end project (HTML/CSS/JS).

1. Download or copy the code into a folder:
   - `index.html`
   - `style.css`
   - `script.js`
2. Open `index.html` in your browser.

### Gemini API Key
To use **AI Feedback**, paste your Gemini API key in the input box.
(For classroom/demo use only.)

## 🧩 Customization
### Add images to events
Each event object supports:
- `id` (string)
- `text` (string)
- `imageUrl` (string)

Example:
```js
{ id: "w1", text: "June 28, 1914: Assassination in Sarajevo.", imageUrl: "https://..." }


