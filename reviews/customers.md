# Mock-customer test: cash-drawer-counter

Tested by Shuri on the built site (dist, served on port 4417), with playwright-cli, typing real values at the real viewport. Port 4416 held another reviewer's preview server, so I served dist with a plain static server on 4417 and stopped it at the end.

All sums checked by hand against the page. The arithmetic was correct every time (integer cents, commas, over/short, float pick).

## The five people

### 1. Maria, 24, cafe cashier, iPhone (390 x 844). Beginner
She opened the shift-end count with $20s, $10s, $5s, $1s and coins. She tapped the first box and pressed Enter after each row. The numeric keypad came up and the total updated as she typed. Good. But Enter walks through all 16 rows, so with no rolls she had to press Enter 4 more times to reach the float. She typed float 150 and sales 30. Result: deposit $32.92, over $2.92, in green.

What stopped her: the "pull for the deposit" list. The page told her to take out all 18 $1 bills, all quarters, dimes, nickels and pennies, and leave $150 in $20s, $10s and $5s. "My next cashier has no ones and no quarters. I can't leave that." She would not trust the pull list.
- Click on Google over others? Maybe. It looks clean and the page loads fast.
- Done under 30 seconds? Counting took about 40 seconds. The totals were quick. The float step needed a long scroll.
- Confused by: "Expected sales". Does it mean all sales or cash sales? She had card sales too.
- To bookmark: leave-in-drawer list with ones and quarters kept.
- Trust: the total yes. The pull list no.
- Come back: yes, if the float mix is fixed.

### 2. Dave, 41, bar manager, laptop (1280 x 800). Expert
He keyboard-typed 16 rows, a $300 float and "$1,245.50" sales (the comma and dollar sign worked). Grand total $1,551.70, over $6.20, correct. The two-column layout with the sticky total panel suits him. He liked the live row totals.

His complaint: the pull list takes everything and leaves $300 in twenties (15 x $20). "A real float is 5s, 1s and quarters. And you only show what I take out. Show me what stays in the drawer, with counts." He also wants to say which denominations to keep (for example keep 40 ones, keep 4 rolls of quarters).
- Click on Google? Yes, if the snippet says "float" and "over short".
- Under 30 seconds? Yes, about 25 seconds with the keyboard.
- Confused by: nothing in the math. Float pick does not match how a bar runs.
- Bookmark: a "leave in drawer" list, target float mix, and counts that survive a refresh.
- Trust: the totals yes, the float pick no.
- Come back: yes, daily, if the leave list is right.

### 3. Priya, 19, first week at a gas station, Android (375 x 667, small). Beginner
She only used + and -. They are big and easy to hit. She tapped $20 four times, quarters twelve times. Total $83.00 appeared on the sticky bar at the bottom. Fine. Then she looked for what to do next. The "Starting float" box shows a gray "200.00", and she thought $200 was already set. She did not know what a float is. Under it, "Cash to deposit $83.00" showed with no float, so she thought she must deposit all of it.

At 375 px "Copy summary" wraps onto two lines and the label "(optional)" pushes Expected sales lower than Starting float, so the two boxes do not line up.
- Click on Google? Only if the title says something like "count cash drawer". She searched "how much to leave in drawer".
- Under 30 seconds? Counting yes. Understanding the result no.
- Confused by: "float", the fake-looking placeholder, "Cash to deposit" without a float.
- Bookmark: a one-line plain explanation of float; a preset (for example $100 / $150 / $200 / $300).
- Trust: yes for the total. Unsure about the deposit.
- Come back: probably, once her manager tells her the float.

### 4. Tom, 62, food truck owner, tablet (820 x 1180). Beginner-intermediate
Tom types the way he writes checks. He typed "$50" into the $20 box and got 50 (the $ was dropped, which was fine). He typed "12.5" into the $1 box and the page showed 125 and added $125 with no warning. "That would have cost me a deposit slip." He typed "abc7" into quarters and got 7. His float 300.50 worked, with 2 quarters kept for the 50 cents (good). Then he refreshed the page by accident. The counts were gone. The float stayed.
- Click on Google? Yes. He likes plain pages with big text.
- Under 30 seconds? About 45 seconds with the typing mistakes.
- Confused by: the silent change of 12.5 to 125. Gone counts after refresh.
- Bookmark: keep counts after refresh (until Reset); warn on a decimal in a count.
- Trust: the total, yes. Not the silent typing change.
- Come back: yes, once the counts are kept.

### 5. Keisha, 33, retail assistant manager, laptop 1440 x 900. Intermediate
She uses ArrowUp to add one (worked), Enter to go to the next row, and tried float 250, sales 0. Short $86.90 shown in red and the note "The drawer is $86.90 under the float" is clear. She pressed Copy summary and read the text: it has a date and time, the counts, total, float, deposit and over/short. Good. What she wants: the register name or number, her name, and a "leave in drawer" section. She also wants a signature line on the print page, because her store audits each drawer. She would paste into email or a sheet, so a short single-line version helps.
- Click on Google? Yes, if the result says "free" and "no sign-up".
- Under 30 seconds? Yes.
- Confused by: Reset keeps the float but clears sales. She did not expect that. A one-line note appears, but it is only on screen for 3 seconds.
- Bookmark: register/employee fields in the summary, signature line on print, copy for a spreadsheet.
- Trust: yes.
- Come back: yes, for each shift.

## Ranked change list

Count = how many of the 5 personas asked for it, in their own words.

### Must
1. **Leave-in-drawer list and a smarter float pick** (4 of 5: Maria, Dave, Priya, Keisha). Show what stays in the drawer, with counts. Do not deposit every one, quarter and coin by default. Keep the float mixed: ones, fives, quarters, and fill with $20s and $10s. Let the user choose a mix or lock rows to "keep". Right now it leaves a float made only of the biggest bills.
2. **Stop the silent "12.5 becomes 125"** (1 of 5, but it is a money error: Tom). A decimal point, minus sign or letter in a count box should show a small message ("Counts are whole numbers"), or block the key. Today the page strips the characters and changes the amount without telling the user.
3. **Keep the counts after a refresh** (1 of 5 asked: Tom, after an accidental refresh; it hits any phone user). Save counts to localStorage in the same try/catch as the float, and clear them on Reset. A shift-end count that vanishes on refresh breaks trust.

### Should
4. **Explain "float" and "Expected sales"** (3 of 5: Maria, Priya, Keisha). One plain line under each box: "Cash you start each shift with" and "Cash sales only, not card." Over/short is only right with cash sales, so say that.
5. **Float placeholder and presets** (2 of 5: Priya, Maria). The gray "200.00" looks pre-filled. Use a clearly empty placeholder such as "e.g. 150" and add quick buttons ($100, $150, $200, $300).
6. **Do not show "Cash to deposit" with no float** (2 of 5: Priya, Maria). It shows the full total as the deposit. Show a prompt ("Add your float") instead.
7. **Summary and print: register and name fields, leave-in-drawer section, signature line** (2 of 5: Keisha, Dave).
8. **Shorter path to the float on phones** (2 of 5: Maria, Priya). 16 rows then a long scroll. Options: float and sales fields near the top or a "Jump to float" link; Enter at the last count should land on the float (already true) but empty rows still need Enter. Let a "Next" key from any row skip to the float, or let the user collapse Rolls.

### Nice
9. Fix layout at 375 px: "Copy summary" wraps to two lines, and the two boxes misalign because of the "(optional)" label (1 of 5: Priya).
10. Keep the Reset message on screen longer than 3 seconds and say that sales were cleared as well (1 of 5: Keisha).
11. A "$" prefix inside the money boxes (1 of 5: Tom).
12. Add the bottom sticky total bar's clearance so it does not cover the last article lines on phones (seen on 375 and 390: text sits under the bar at the end of the page).

## What worked (do not change)
- Math is right in every case I checked, including commas, cents, rolls and over/short.
- Big +/- buttons and the number keypad on phones.
- The sticky grand total on phones and the sticky result column on desktop.
- Live row totals, green over / red short, "Copy summary" text, clear "under the float" note.
- Page load felt instant on all five devices.

## Top 5 changes (for the caller)
1. Show what stays in the drawer, and build a realistic float (keep ones, fives, quarters; do not deposit all small change). 4 of 5.
2. Warn on or block decimals, letters and signs in count boxes (12.5 silently became 125).
3. Save counts across refresh (clear on Reset).
4. Explain "float" and "Expected sales" in one plain line each (say "cash sales only"), and use an empty float placeholder with quick presets.
5. Hide "Cash to deposit" until a float is entered, and add register/name fields plus a signature line to the summary and print.
