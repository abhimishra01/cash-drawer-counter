// Landing pages for specific searches. Each page has its own text, and the tool opens with the preset float.
// Keep each page different in substance: no copy-paste between pages.
export interface Section {
  h: string;
  p?: string[];
  ul?: string[];
  ol?: string[];
  plans?: string[];                       // keys of FLOAT_PLANS, shown as one comparison table
  table?: { head: string[]; rows: string[][]; wide?: boolean };  // wide: text in the last column
}
export interface Guide {
  slug: string;
  title: string;                          // full <title>
  h1: string;
  description: string;
  intro: string;
  presetFloat: string;                    // text put in the float field when nothing is saved
  sections: Section[];
  faq: { q: string; a: string }[];
  related: string[];                      // slugs, shown at the bottom
  linkLabel: string;                      // link text on the home page
}

export const guides: Guide[] = [
  {
    slug: 'cash-drawer-float-calculator',
    title: 'Cash Drawer Float Calculator | Starting Bank',
    h1: 'Cash drawer float calculator',
    linkLabel: 'Cash drawer float calculator',
    description: 'Count your drawer, enter your float, and see the exact bills and coins to leave behind. Includes sample $100, $200 and $300 float breakdowns.',
    intro: 'Count your drawer, type your float, and the calculator shows the cash to deposit and the exact bills and coins to leave behind. The float below is set to $200. Change it to your own number.',
    presetFloat: '200',
    sections: [
      { h: 'What a float is for', p: [
        'A float is the cash that stays in the drawer so the next shift can make change. It is also called a starting bank, a till float or an opening bank. It is not sales money. It is the same amount every day, so the drawer is easy to check.',
      ] },
      { h: 'What a good float looks like', p: [
        'A float made only of $20 bills cannot make change for a $3 coffee. A good float is mostly small bills with some coins. The calculator follows this rule. It aims for about 40% of the float in $20 bills, then $10, $5 and $1 bills, with a few quarters, dimes, nickels and pennies.',
        'It never leaves $100 or $50 bills in the drawer. If your cash cannot make the float exactly, it tells you how much is missing, so you can break a bill by hand.',
      ] },
      { h: 'Sample float breakdowns', p: ['These are three common starting points. Your shop may use a different mix.'], plans: ['f100', 'f200', 'f300'] },
      { h: 'How to pick the amount', ul: [
        'Think about your busiest half hour. The float must cover all the change you give in that rush.',
        'Count how many customers pay with a $20 bill. Each one needs change from the float.',
        'Many small shops use $100 to $300 per drawer. Your owner or manager sets the number. Use theirs.',
        'If you run out of $1 bills or quarters before closing, the float is too small or the mix is wrong. Tell your manager.',
      ] },
      { h: 'Use the opening count as your float', p: [
        'At the start of a shift, count what is in the drawer. Type the counts into the calculator and press "Use this count as my float". The float field fills in with the total. The calculator keeps it on your device, so tonight you only enter the closing count.',
      ] },
    ],
    faq: [
      { q: 'Is the float part of my sales?', a: 'No. The float is the cash that was in the drawer before the first sale. Sales are the cash you took in after that. The deposit is the total minus the float.' },
      { q: 'Can the float be all $1 bills and coins?', a: 'It can, but you will run out of change for larger bills. A mix of $20, $10, $5 and $1 bills with some coins works best.' },
      { q: 'What if I cannot make the exact float?', a: 'The calculator leaves as much as it can and shows the missing amount. Swap a larger bill for smaller ones at the safe, then count again.' },
    ],
    related: ['how-much-to-leave-in-cash-drawer', 'close-out-register-checklist', 'cash-drawer-over-short-calculator'],
  },
  {
    slug: 'how-much-to-leave-in-cash-drawer',
    title: 'How Much to Leave in the Cash Drawer | Till Float',
    h1: 'How much to leave in the cash drawer',
    linkLabel: 'How much to leave in the cash drawer',
    description: 'Typical amounts to leave in a cash drawer for a cafe, store, food truck or bar, and how to take out the rest. Enter your count to see the deposit.',
    intro: 'The amount you leave in the drawer is your float. Your owner or manager sets it. This page lists the common ranges by business, then lets you count your drawer and see what to take out. The float is set to $200 as a start.',
    presetFloat: '200',
    sections: [
      { h: 'Common amounts by business', p: ['These are starting points that shops often use, not rules. Busy locations leave more.'], table: {
        wide: true,
        head: ['Business', 'Typical float', 'Why'],
        rows: [
          ['Coffee shop', '$100 to $200', 'Many small sales, lots of $1 and $5 bills'],
          ['Retail store', '$100 to $250', 'Mixed sales, some large bills'],
          ['Convenience store', '$150 to $300', 'Many cash sales, lottery and customers who need change'],
          ['Food truck or stand', '$100 to $250', 'Small space, fast lines'],
          ['Bar', '$200 to $500', 'Many drinks paid with $20 bills'],
          ['Farmers market stall', '$100 to $200', 'Busy peaks, small sales'],
        ],
      } },
      { h: 'How to take out the rest', ol: [
        'Count every bill and coin in the drawer.',
        'Type your float in the Starting float field.',
        'Read the "Take out for the deposit" list. Remove those bills and coins.',
        'Check the "Leave in the drawer" list against what is left. It adds up to your float.',
        'Put the deposit in a bag with the printed count and sign it.',
      ] },
      { h: 'When the drawer has less than the float', p: [
        'On a slow day the drawer may hold less than the float. The calculator then shows a deposit of $0.00 and a note that the drawer is under the float. Do not take cash from the safe to fill the gap unless your manager says so. Tell your manager and write it on the count sheet.',
      ] },
      { h: 'Why not leave more?', p: [
        'Cash in the drawer is cash that can be lost or taken. A float that is bigger than you need adds risk and no benefit. Leave enough for change and no more.',
      ] },
    ],
    faq: [
      { q: 'How much money should I leave in the till overnight?', a: 'Only the float, in small bills and coins. Many shops also lock the drawer or empty it into a safe overnight. Follow your shop rule.' },
      { q: 'Should the float change from day to day?', a: 'Usually no. A fixed float makes it easy to check the drawer. Change it only when your manager says so, for example for a busy season.' },
      { q: 'Do I leave the tips in the drawer?', a: 'No. Tips are not sales and not float. Count them apart and follow your shop rule for tip-out.' },
    ],
    related: ['cash-drawer-float-calculator', 'cash-drop-calculator', 'coffee-shop-cash-drawer-count'],
  },
  {
    slug: 'cash-drawer-over-short-calculator',
    title: 'Cash Drawer Over and Short Calculator | Find the Difference',
    h1: 'Cash drawer over and short calculator',
    linkLabel: 'Cash drawer over and short calculator',
    description: 'Count the drawer, add the float, cash sales and paid-outs, and see if you are over, short or balanced. Includes the formula and a worked example.',
    intro: 'Count the drawer, then enter your float, your cash sales from the register report, and any cash you paid out. The calculator shows if the drawer is over, short or balanced. Cash you paid out of the drawer is optional. It makes the formula exact.',
    presetFloat: '200',
    sections: [
      { h: 'The formula', p: [
        'Expected cash in the drawer = starting float + cash sales - paid-outs.',
        'Over or short = cash you counted - expected cash. A positive number is over. A negative number is short. Zero is balanced.',
      ] },
      { h: 'Worked example', table: {
        head: ['Item', 'Amount'],
        rows: [
          ['Starting float', '$200.00'],
          ['Cash sales from the register report', '$640.00'],
          ['Paid out of the drawer (supplies)', '$20.00'],
          ['Expected in the drawer', '$820.00'],
          ['Counted in the drawer', '$812.50'],
          ['Result', 'Short $7.50'],
        ],
      } },
      { h: 'Which sales number to use', p: [
        'Use cash sales only. Do not use card, gift card or mobile pay sales. Take the number from the end-of-shift report, after you stop sales. A sale that comes in after you print the report causes a false overage.',
      ] },
      { h: 'Common causes of a short drawer', ul: [
        'Wrong change given, mostly on large bills.',
        'A paid-out or refund that was not written down.',
        'A voided sale where cash was returned.',
        'A bill under the tray or in another drawer.',
        'Two bills stuck together when counted.',
        'A mistake in the last shift handover.',
      ] },
      { h: 'Common causes of an over drawer', ul: [
        'Change not given, or a customer who left before the change.',
        'A sale rung on a card but paid in cash.',
        'Tips dropped in the drawer.',
        'A paid-out that you wrote down but did not take out.',
      ] },
      { h: 'What to do about a difference', p: [
        'Recount first, a different way the second time. Then check paid-outs, refunds and voids. A few dollars of difference is common. A large or repeated difference needs a manager. Follow your shop policy. Do not take money from the drawer to cover a shortage.',
      ] },
    ],
    faq: [
      { q: 'Is over or short based on the deposit?', a: 'No. It uses the full count. The calculator compares the total in the drawer with float + cash sales - paid-outs. The deposit is the total minus the float.' },
      { q: 'How much over or short is normal?', a: 'Small amounts under a few dollars are common. Your shop sets its own limit, so ask your manager.' },
      { q: 'Do I enter tips?', a: 'No. If tips were put in the drawer, take them out before you count, or the drawer will show over.' },
    ],
    related: ['close-out-register-checklist', 'cash-drawer-float-calculator', 'cash-register-count-sheet'],
  },
  {
    slug: 'cash-drop-calculator',
    title: 'Cash Drop Calculator | How Much to Take Out of the Drawer',
    h1: 'Cash drop calculator',
    linkLabel: 'Cash drop calculator',
    description: 'Count the drawer during a shift and see how much cash to drop in the safe while leaving a working amount behind. Free, private, no signup.',
    intro: 'A cash drop is when you move extra cash from the register to the safe during a shift. Count the drawer, enter the amount you want to keep working, and the calculator shows how much to drop and which bills to take. The amount to keep is set to $250 here.',
    presetFloat: '250',
    sections: [
      { h: 'How to use it for a drop', ol: [
        'Count all the cash in the drawer.',
        'In the Starting float field, type the amount you want to keep in the drawer. This is your working level for the rest of the shift.',
        'Read the "Take out for the deposit" list. That is your drop.',
        'Put the drop in a drop envelope and write the amount on it. Sign it, and have a second person sign if your shop requires it.',
        'Put the envelope in the safe. Leave the working level in the drawer.',
      ] },
      { h: 'Why shops drop cash', p: [
        'Large amounts of cash in a register attract theft and make the drawer harder to count. Many shops set a limit, for example "drop when the drawer holds more than $500". Your shop sets its own limit. The drop keeps the drawer lean.',
      ] },
      { h: 'Which bills to drop first', p: [
        'Drop large bills first. Leave small bills and coins, because you need them for change. The calculator does this: it never keeps $100 or $50 bills in the drawer and builds the working level from small bills and coins.',
      ] },
      { h: 'Drop log fields', p: ['Write down each drop. A good log has these fields:'], ul: [
        'Date and time',
        'Register number',
        'Cashier name',
        'Amount dropped',
        'Second signature, if required',
        'Envelope or bag number',
      ] },
      { h: 'Drop at the end of the shift too', p: [
        'At close, a drop is the same as a deposit. Count the drawer, enter the float, and the take-out list is your end-of-day deposit.',
      ] },
    ],
    faq: [
      { q: 'What is a cash drop?', a: 'A cash drop is moving extra cash from the register to a safe during the shift. It lowers the amount at risk and keeps the drawer easy to count.' },
      { q: 'How much should I leave after a drop?', a: 'Leave enough to make change until the next drop. Many shops keep the normal float plus a little extra for busy hours. Ask your manager for the number.' },
      { q: 'Do I need to count twice for a drop?', a: 'Yes, if the amount is large. Count once, then have a second person check the envelope, and sign the log.' },
    ],
    related: ['how-much-to-leave-in-cash-drawer', 'close-out-register-checklist', 'bar-cash-drawer-count'],
  },
  {
    slug: 'cash-drawer-count-with-rolls',
    title: 'Cash Drawer Count With Coin Rolls | Roll Values and Counts',
    h1: 'Cash drawer count with coin rolls',
    linkLabel: 'Count a drawer with coin rolls',
    description: 'How much a roll of quarters, dimes, nickels, pennies, half dollars and dollar coins is worth, and how to count full and loose coins in one drawer.',
    intro: 'This calculator has a row for each full roll and a row for loose coins. Type the number of full rolls in the roll rows. Type the loose coins in the coin rows. Both add to the same total.',
    presetFloat: '200',
    sections: [
      { h: 'Roll values', table: {
        head: ['Roll', 'Coins', 'Value'],
        rows: [
          ['Quarters', '40', '$10.00'],
          ['Dimes', '50', '$5.00'],
          ['Nickels', '40', '$2.00'],
          ['Pennies', '50', '$0.50'],
          ['Half dollars', '20', '$10.00'],
          ['Dollar coins', '25', '$25.00'],
        ],
      } },
      { h: 'Half dollars and dollar coins', p: [
        'The calculator has no roll row for half dollars or dollar coins. Multiply the rolls by the coins in a roll, and type the result in the coin row. Three rolls of half dollars is 60 coins, so type 60 in the Half dollars row (under More coins). Two rolls of dollar coins is 50 coins, so type 50 in the $1 coins row.',
      ] },
      { h: 'Example', p: [
        'You have 3 rolls of quarters, 2 rolls of dimes, 1 roll of nickels and 18 loose quarters.',
      ], table: {
        head: ['Item', 'Math', 'Value'],
        rows: [
          ['3 quarter rolls', '3 x $10.00', '$30.00'],
          ['2 dime rolls', '2 x $5.00', '$10.00'],
          ['1 nickel roll', '1 x $2.00', '$2.00'],
          ['18 loose quarters', '18 x $0.25', '$4.50'],
          ['Total coins', '', '$46.50'],
        ],
      } },
      { h: 'Checking a roll', p: [
        'Bank rolls are filled by machine and are usually right. Rolls that a customer or a coin machine made can be off by a coin or two. If the drawer is short by a small amount, open one roll and count it.',
      ] },
      { h: 'Partial rolls', p: [
        'Do not count a partial roll as a full one. Count the coins in it and type them in the loose coin row. For example, a roll with 31 quarters is 31 loose quarters.',
      ] },
    ],
    faq: [
      { q: 'How many quarters are in a roll?', a: 'A roll of quarters holds 40 coins and is worth $10.' },
      { q: 'How many dimes are in a roll?', a: 'A roll of dimes holds 50 coins and is worth $5.' },
      { q: 'Are rolls part of the float?', a: 'They can be. Many shops keep a roll or two of each coin in the float to refill the drawer.' },
    ],
    related: ['cash-drawer-float-calculator', 'close-out-register-checklist', 'coffee-shop-cash-drawer-count'],
  },
  {
    slug: 'coffee-shop-cash-drawer-count',
    title: 'Coffee Shop Cash Drawer Count | Float and Closing',
    h1: 'Coffee shop cash drawer count',
    linkLabel: 'Coffee shop cash drawer count',
    description: 'A closing count for a cafe drawer: sample $150 float, what to count and keep apart, and a calculator that shows the deposit.',
    intro: 'A cafe takes many small sales, so the drawer needs a lot of $1 bills, $5 bills and quarters. Count the drawer below. The float is set to $150, a common start for a cafe.',
    presetFloat: '150',
    sections: [
      { h: 'A sample $150 cafe float', p: ['This mix has many ones, fives and quarters for change on drinks under $10.'], plans: ['coffee'] },
      { h: 'Count these apart from the drawer', ul: [
        'The tip jar. Tips are not sales and not float.',
        'Gift card and mobile order slips.',
        'Petty cash for milk or supplies. Write each item on a paid-out slip.',
        'Any cash from catering or an event.',
      ] },
      { h: 'Closing a cafe drawer', ol: [
        'Print the end-of-shift report after the last sale.',
        'Take the tray out and count the cash once.',
        'Enter the cash sales from the report and any paid-outs. The calculator shows over or short.',
        'Leave the float in the drawer. Bag the deposit with the printed count.',
        'Sign the count. Have the manager sign it if your cafe requires.',
      ] },
      { h: 'Why cafes run low on small bills', p: [
        'Most drinks cost under $10, and many people pay with a $20 bill. Each one takes a $5 and several $1 bills from the drawer. By late morning the ones run low. If this happens often, raise the number of $1 bills in the float, or drop large bills to the safe more often.',
      ] },
      { h: 'A morning check', p: [
        'Count the drawer before the doors open. If your manager sets the float from the opening count, press "Use this count as my float". A short opening drawer is much easier to explain at 7 a.m. than at 3 p.m.',
      ] },
    ],
    faq: [
      { q: 'How much should a coffee shop leave in the drawer?', a: 'Many cafes use $100 to $200. A $150 float with lots of $1 and $5 bills works for a small shop. Your owner sets the number.' },
      { q: 'Where do tips go?', a: 'Keep tips out of the drawer. Count them apart and share them by your shop rule.' },
    ],
    related: ['how-much-to-leave-in-cash-drawer', 'cash-drawer-count-with-rolls', 'close-out-register-checklist'],
  },
  {
    slug: 'food-truck-cash-drawer-count',
    title: 'Food Truck Cash Drawer Count | Float and Closing',
    h1: 'Food truck cash drawer count',
    linkLabel: 'Food truck cash drawer count',
    description: 'Count a food truck cash box after service. Sample $200 float, tips for events and wind, and a calculator that shows the deposit.',
    intro: 'A truck has little space and long lines at peak. Count the cash box when service ends. The float below is set to $200.',
    presetFloat: '200',
    sections: [
      { h: 'A sample $200 truck float', p: ['Tens and fives help most, because meals often cost $10 to $15.'], plans: ['truck'] },
      { h: 'Counting after an event', ol: [
        'Stop taking orders and close the window.',
        'Move the cash box inside the truck, away from the window.',
        'Take out and count it once at a flat surface. Wind can move bills.',
        'Type the counts into the calculator.',
        'Enter the cash sales from your sales app or paper tickets, and any cash you paid for ice or supplies.',
        'Take the deposit out, lock the float, and sign the count.',
      ] },
      { h: 'Protect the cash during service', ul: [
        'Keep only the float and a short working amount in the box.',
        'Move large bills to a lock box every hour or two. See the cash drop calculator.',
        'Keep the box out of sight of the window.',
        'Never leave the box alone, even for a minute.',
      ] },
      { h: 'Events and fees', p: [
        'At festivals you may pay a fee in cash or take a deposit on a permit. Write each one as a paid-out so the over and short check stays right.',
      ] },
    ],
    faq: [
      { q: 'How much float does a food truck need?', a: 'Many trucks start with $100 to $250. Choose more for a big event with long lines. Your owner sets the number.' },
      { q: 'Do I count cash after every event?', a: 'Yes. Count after each event or each day, whichever comes first, and keep the count sheet with the deposit.' },
    ],
    related: ['cash-drop-calculator', 'close-out-register-checklist', 'how-much-to-leave-in-cash-drawer'],
  },
  {
    slug: 'close-out-register-checklist',
    title: 'Close Out Register Checklist | Cash Up the Till Step by Step',
    h1: 'Close out register checklist',
    linkLabel: 'Close out register checklist',
    description: 'A step-by-step checklist to close out a register or cash up a till, with a calculator that counts the drawer and shows the deposit.',
    intro: 'Use this checklist to close out a register. Do the steps in order. The calculator below handles the count, the deposit and the over or short check.',
    presetFloat: '200',
    sections: [
      { h: 'The checklist', ol: [
        'Stop sales on the register. Do not ring any new sale.',
        'Print the end-of-shift report. Note the cash sales number.',
        'Write down any paid-outs, refunds and voids paid in cash.',
        'Take the cash tray out of the drawer. Look under it for loose bills.',
        'Remove tips, checks, coupons and gift cards. Count those apart.',
        'Count the cash with the calculator. Count each type once.',
        'Enter the float, the cash sales and the paid-outs.',
        'Read the result: over, short or balanced.',
        'If the result is not balanced, recount a different way.',
        'Take out the deposit using the list. Leave the float.',
        'Put the deposit in the bag with the printed count. Sign it.',
        'Lock the drawer or move it to the safe, as your shop requires.',
      ] },
      { h: 'Tips and checks', p: [
        'Tips are not part of the cash count. Follow your shop rule for tip-out. Paper checks go in the deposit but are not cash, so list them on their own line.',
      ] },
      { h: 'Handing over to another cashier', p: [
        'When one cashier hands the drawer to the next, both count it together. Both sign the count sheet. The next cashier starts from a known amount. This stops disputes about who caused a shortage.',
      ] },
      { h: 'What to keep', p: [
        'Keep the printed count, the register report and the deposit receipt together. Many shops keep them for a year or more. Ask your manager or accountant how long to keep them.',
      ] },
    ],
    faq: [
      { q: 'What does it mean to cash up a till?', a: 'To cash up is to count the cash at the end of a shift, compare it with the sales report, and prepare the deposit. It is the same as closing out a register.' },
      { q: 'Should I count the drawer in front of someone?', a: 'Many shops require a second person to watch or sign the count. It protects you and the shop. Follow your policy.' },
      { q: 'How long does a close-out take?', a: 'With this calculator a single drawer takes a few minutes. Most of that time is sorting the bills.' },
    ],
    related: ['cash-drawer-over-short-calculator', 'cash-register-count-sheet', 'cash-drop-calculator'],
  },
  {
    slug: 'bar-cash-drawer-count',
    title: 'Bar Cash Drawer Count | Float, Tabs and Close Out',
    h1: 'Bar cash drawer count',
    linkLabel: 'Bar cash drawer count',
    description: 'Count a bar drawer at close. Sample $300 float heavy in $5 and $1 bills, open tab and tip notes, and a calculator for the deposit.',
    intro: 'Bar drawers move fast, and drinks are often paid with $20 bills. Count the drawer below. The float is set to $300.',
    presetFloat: '300',
    sections: [
      { h: 'A sample $300 bar float', p: ['A bar needs many $5 and $1 bills, plus quarters for odd prices.'], plans: ['bar'] },
      { h: 'Before you count', ul: [
        'Close or transfer all open tabs. A tab that is still open is not cash.',
        'Take tips out of the drawer. Tip-out follows your bar rule, not the count.',
        'Write down every paid-out, for example a delivery paid in cash.',
        'Print the shift report so the cash sales number is final.',
      ] },
      { h: 'One drawer per bartender', p: [
        'If each bartender has an own drawer, count each one alone. Mixing drawers hides who is over or short. The calculator holds one count at a time, so print or copy the summary, press Reset, and count the next drawer.',
      ] },
      { h: 'Counting with a second person', p: [
        'Many bars use two people for the closing count. One counts, one watches, and both sign. Add the cashier name and register in Sheet details so the printed count says whose drawer it was.',
      ] },
      { h: 'Drops during a busy night', p: [
        'On a busy night the drawer fills up with large bills. Drop them to the safe in small batches. See the cash drop calculator to find what to take out and what to keep.',
      ] },
    ],
    faq: [
      { q: 'How much float does a bar need?', a: 'Many bars start with $200 to $500 per drawer. Busy bars need more small bills. Your owner sets the number.' },
      { q: 'Are credit card tips counted as cash?', a: 'No. Card tips are not in the drawer. Only cash that is in the drawer is counted.' },
    ],
    related: ['cash-drop-calculator', 'cash-drawer-over-short-calculator', 'close-out-register-checklist'],
  },
  {
    slug: 'fastest-way-to-count-a-cash-drawer',
    title: 'Fastest Way to Count a Cash Drawer | Step by Step',
    h1: 'Fastest way to count a cash drawer',
    linkLabel: 'Fastest way to count a cash drawer',
    description: 'How to count a cash drawer fast: sort by bill, count in stacks, use coin rolls, and let the counter add it up. Worked example included.',
    intro: 'The fastest way to count a cash drawer is to sort first, count each type once, and let a calculator do the adding. Enter your counts below. The float is set to $200.',
    presetFloat: '200',
    sections: [
      { h: 'How to count a cash drawer in five minutes', ol: [
        'Stop sales and print the shift report, so the cash sales number is final.',
        'Take out all the cash, including bills under the tray.',
        'Sort bills by value and face them the same way. Put the largest on top.',
        'Count each stack once. Type the number into the counter. Start with $100 bills and go down to pennies.',
        'Type the float and the cash sales from the report. Read the deposit, the leave list and over or short.',
      ] },
      { h: 'Tricks that save time', ul: [
        'Count bills in stacks of ten. Count coins in rolls or stacks of ten, not one by one.',
        'Use the Enter key to jump to the next row. On a phone, the number keypad opens by itself.',
        'Keep $1 bills in straps of 100 when you can. A strap of 100 $1 bills is $100.00.',
        'Count once and check the total against the report. Count again only if the drawer is off by more than a few dollars.',
      ] },
      { h: 'Worked example', p: [
        'A cafe closes with 2 $100 bills, 3 $50 bills, 20 $20 bills, 15 $10 bills, 30 $5 bills, 40 $1 bills, 20 quarters, 15 dimes, 10 nickels and 25 pennies.',
        'Bills add up to $1,090.00 and coins to $7.25. The drawer holds $1,097.25. With a $200.00 float, the deposit is $897.25.',
      ] },
      { h: 'Where the time goes', p: [
        'Most of the time goes to recounts. A clean sort and one careful count beat three fast, sloppy ones. If the drawer is off, check for stuck bills and for coupons or checks mixed in with cash before you count again.',
      ] },
    ],
    faq: [
      { q: 'What is the fastest way to count a cash drawer?', a: 'Sort the cash by type, count each type once in stacks, and enter the counts in a calculator. The calculator adds the rows and shows the deposit.' },
      { q: 'How long should a drawer count take?', a: 'A small drawer takes about five minutes with a sorted count. A busy bar or store may take longer.' },
      { q: 'Should I count the drawer twice?', a: 'Count a second time only if the result is off by more than a few dollars. Count a different way the second time, for example by stack size.' },
    ],
    related: ['close-out-register-checklist', 'cash-drawer-count-with-rolls', 'cash-drop-calculator'],
  },
];

export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));
