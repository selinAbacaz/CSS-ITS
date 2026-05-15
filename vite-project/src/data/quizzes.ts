import type { Question } from '../types/quiz';


export const QUESTION_BANK: Question[] = [

  
  {
    id: 'L1T1-Q1', type: 'mcq', topicId: 'L1T1',
    prompt: 'Which HTML attribute is used to apply inline CSS styles?',
    options: [
      { id: 'a', text: 'class', wrongFeedback: 'The class attribute links to a CSS class — it doesn\'t hold style rules directly. ' },
      { id: 'b', text: 'style', },
      { id: 'c', text: 'css', wrongFeedback: 'There is no "css" attribute in HTML. ' },
      { id: 'd', text: 'format', wrongFeedback: '"format" is not a valid HTML attribute' },
    ],
    correctId: 'b',
    correctFeedback: 'Correct ! The style attribute lets you write CSS rules directly on any HTML element- eg <p style="color:red">. <br></br>"css" and "format" are not valid HTML attributes. class is a valid for adding *external* css, not inline',
  },
  {
    id: 'L1T1-Q2', type: 'mcq', topicId: 'L1T1',
    prompt: 'Which of the following is a valid example of inline CSS?',
    options: [
      { id: 'a', text: '<p class="color: red;">Text</p>', wrongFeedback: 'the class attribute is used to call CSS from external stylesheets, not for inline. ' },
      { id: 'b', text: '<style>p { color: red; }</style>', wrongFeedback: 'This is embedded CSS inside a <style> tag, not inline.  ' },
      { id: 'c', text: '<p style="color: red;">Text</p>' },
      { id: 'd', text: '<p css="color: red;">Text</p>', wrongFeedback: '"css" is not a real HTML attribute.' },
    ],
    correctId: 'c',
    correctFeedback: `Correct ! Inline CSS uses style="property: value;" directly on the element tag. Notice how it is inside the host tag "< here >" and called via "style" specifically- "class" would also work for adding CSS but only for CSS called from a stylesheet and not for inline. Applying CSS through a style tag is also possible but only for embedded CSS.`,
  },
  {
    id: 'L1T1-Q3', type: 'mcq', topicId: 'L1T1',
    prompt: 'Which statement about inline CSS is TRUE?',
    options: [
      { id: 'a', text: 'It has the lowest specificity of all CSS methods.', wrongFeedback: 'Actually the opposite- inline styles have the HIGHEST specificity and override most other rules.' },
      { id: 'b', text: 'It can use :hover and other pseudo-classes.', wrongFeedback: 'Pseudo-classes like :hover cannot be used inside an inline style attribute- they require a stylesheet.' },
      { id: 'c', text: 'It applies styles to all elements on the page.', wrongFeedback: 'Inline CSS only targets the single element it is written in, not the whole page.' },
      { id: 'd', text: 'It has the highest specificity of all CSS methods.' },
    ],
    correctId: 'd',
    correctFeedback: `Correct ! Inline CSS beats external and embedded styles in the specificity cascade,which is why it should be used sparingly.  Inline css also cannot used pseudo classes, only stylesheets can. Inline Css also does not apply styles to all elements on the page, it is specific to the tag its applied to. `,
  },
  {
    id: 'L1T1-Q4', type: 'mcq', topicId: 'L1T1',
    prompt: 'When is inline CSS most appropriate to use?',
    options: [
      { id: 'a', text: 'For styling an entire website consistently.' , wrongFeedback: 'External CSS is the right tool for site-wide consistency, not inline styles- this is because inline does not scale well and it would be very hard to maintain.' },
      { id: 'b', text: 'Rapid prototyping, overriding specific elements.' },
      { id: 'c', text: 'Whenever you want to use :hover effects.', wrongFeedback: ':hover requires a stylesheet; it cannot be applied with inline styles ' },
      { id: 'd', text: 'To keep styles centralized and maintainable.', wrongFeedback: 'Inline styles are scattered across your HTML — they are the hardest to maintain.' },
    ],
    correctId: 'b',
    correctFeedback: `Correct ! Rapid prototyping, overriding specific elements are two scenarios where inline CSS is best used.  It wouldnt work for styling an entire website because it does not scale well. It also cant be used for hover effects as a style sheet is needed for that. And lastly, inline cant be centralized because its scope is only the tag its applied to. `,
  },
  {
    id: 'L1T1-Q5', type: 'mcq', topicId: 'L1T1',
    prompt: 'What is the scope of inline CSS?',
    options: [
      { id: 'a', text: 'the tag its applied to'},
      { id: 'b', text: 'all tags in the file', wrongFeedback:'Inline CSS does not affect the entire page. It only styles the specific element where the style attribute is written'},
      { id: 'c', text: 'all tags of the same type', wrongFeedback:'Inline CSS does not target groups of elements. To style all tags of the same type, you would use a CSS selector. It only styles the specific element where the style attribute is written',},
      { id: 'd', text: 'Only child elements inside the tag', wrongFeedback: 'Inline CSS applies directly to the element itself. Some properties like color or font may inherit to children, but the styles are not automatically applied to all child elements.',},
    ],
    correctId: 'a',
    correctFeedback: ` Correct! Inline CSS only applies directly to the specific HTML element (and children if properties are inheritable) where the style attribute is written. 
     Inline css does not affect the entire page, and it does not target groups of elements (you can do this in embedded and external css). 
     It also does NOT automatically apply to all child elements, only inheritted properties apply `,
  },

  // Lesson 1 Topic 2, Embedded CSS 
  {
    id: 'L1T2-Q1', type: 'mcq', topicId: 'L1T2',
    prompt: 'Where does embedded (internal) CSS go in an HTML document?',
    options: [
      { id: 'a', text: 'Inside the <body> tag', wrongFeedback: 'While browsers may tolerate it, the correct and standard place is inside the <head> tag.' },
      { id: 'b', text: 'In a separate .css file', wrongFeedback: 'That describes external CSS. Embedded CSS lives inside the HTML file itself.' },
      { id: 'c', text: 'Inside a <style> tag in the <head>', },
      { id: 'd', text: 'As an attribute on each element', wrongFeedback: 'Writing styles as attributes is called inline CSS, not embedded CSS.' },
    ],
    correctId: 'c',
    correctFeedback: 'Correct! Embedded CSS lives in a <style> block inside the <head> — it scopes styles to that single HTML file.',
  },
  {
    id: 'L1T2-Q2', type: 'mcq', topicId: 'L1T2',
    prompt: 'What is the main limitation of embedded CSS?',
    options: [
      { id: 'a', text: 'It cannot use class selectors.', wrongFeedback: 'Embedded CSS supports all CSS selectors — classes, IDs, pseudo-classes, everything.' },
      { id: 'b', text: 'It does not support animations.', wrongFeedback: 'Embedded CSS fully supports @keyframes and animations.' },
      { id: 'c', text: 'Styles only apply to the single page containing the <style> tag.' },
      { id: 'd', text: 'It overrides all inline styles.', wrongFeedback: 'Inline styles have higher specificity and override embedded styles, not the other way around.' },
    ],
    correctId: 'c',
    correctFeedback: 'Exactly! Embedded CSS is page-scoped. To share styles across multiple pages you need external CSS.',
  },
  {
    id: 'L1T2-Q3', type: 'mcq', topicId: 'L1T2',
    prompt: 'Which scenario is embedded CSS BEST suited for?',
    options: [
      { id: 'a', text: 'A 50-page marketing website', wrongFeedback: 'You would have to copy the <style> block into all 50 pages — external CSS is the right choice here.' },
      { id: 'b', text: 'A single-page prototype or demo' },
      { id: 'c', text: 'Styling one tag', wrongFeedback: 'While embedded CSS has the power to style one tag, one tag does not use its full potential of being applied to any tag in that page' },
      { id: 'd', text: 'Production apps with multiple developers', wrongFeedback: 'Teams usually use external CSS files rather than embedded because it can be version-controlled and shared easier.' },
    ],
    correctId: 'b',
    correctFeedback: `Right! For a quick single-page prototype, embedded CSS keeps everything in one file without the overhead of linking external sheets. 
    It is the perfect use considering that embedded CSS can only be used in one page but it has enough power to be applied to any tag in that page. `,
  },
  {
    id: 'L1T2-Q4', type: 'mcq', topicId: 'L1T2',
    prompt: 'What is the scope of embedded CSS ?',
    options: [
      { id: 'a', text: 'Any file it is exported into', wrongFeedback:' Almost ! The scope of Embedded CSS is bigger than inline CSS, but not big enough to be used across multiple files'},
      { id: 'b', text: 'The file it is defined in'},
      { id: 'c', text: 'All tags in the file', wrongFeedback:'While embedded CSS can be used on any tag in the same file, it is not automatically applied to every tag, only the tags redefine in the style tag or tags that have a class attribute attached',},
      { id: 'd', text: 'A single tag', wrongFeedback: 'The nature of embedded CSS allows you to use the same CSS across more than one tag',},
    ],
    correctId: 'b',
    correctFeedback: ` Correct! Embedded CSS can be used anywhere inside the single file it is defined in, rather than just a single tag like inline CSS. 
    You can redefine tags using embedded css, or create class selectors that you can apply to tags via the class="" attribute. It is important to note that while embedded css can be used anywhere in the file, it does not automatically apply
    css to all tags, only the tags with a class applied to them or a matching element selector in the style tag `,
  },
  {
    id: 'L1T2-Q5', type: 'mcq', topicId: 'L1T2',
    prompt: 'What is the scope of embedded CSS ?',
    options: [
      { id: 'a', text: 'Any file it is exported into', wrongFeedback:' Almost ! The scope of Embedded CSS is bigger than inline CSS, but not big enough to be used across multiple files'},
      { id: 'b', text: 'The file it is defined in'},
      { id: 'c', text: 'All tags in the file', wrongFeedback:'While embedded CSS can be used on any tag in the same file, it is not automatically applied to every tag, only the tags redefine in the style tag or tags that have a class attribute attached',},
      { id: 'd', text: 'A single tag', wrongFeedback: 'The nature of embedded CSS allows you to use the same CSS across more than one tag',},
    ],
    correctId: 'b',
    correctFeedback: ` Correct! Embedded CSS can be used anywhere inside the single file it is defined in, rather than just a single tag like inline CSS. 
    You can redefine tags using embedded css, or create class selectors that you can apply to tags via the class="" attribute. It is important to note that while embedded css can be used anywhere in the file, it does not automatically apply
    css to all tags, only the tags with a class applied to them or a matching element selector in the style tag `,
  },


  // Lesson 1 topic 3 External CSS
  {
    id: 'L1T3-Q1', type: 'mcq', topicId: 'L1T3',
    prompt: 'Which HTML tag is used to link an external CSS file?',
    options: [
      { id: 'a', text: '<style>', wrongFeedback: '<style> is for embedded CSS written directly inside the HTML file.' },
      { id: 'b', text: '<script>', wrongFeedback: '<script> links JavaScript files, not CSS.' },
      { id: 'c', text: '<link rel="stylesheet">' },
      { id: 'd', text: '<css src="...">', wrongFeedback: '<css> is not a real HTML element.' },
    ],
    correctId: 'c',
    correctFeedback: 'Correct! <link rel="stylesheet" href="styles.css"> in the <head> is how you connect an external CSS file.',
  },
  {
    id: 'L1T3-Q2', type: 'mcq', topicId: 'L1T3',
    prompt: 'Why do browsers load external CSS files faster on repeat visits?',
    options: [
      { id: 'a', text: 'Because CSS files are automatically compressed by the browser.', wrongFeedback: 'Compression is a server-side feature (gzip/brotli), not automatic browser behaviour.' },
      { id: 'b', text: 'Because the browser caches the CSS file after the first download.' },
      { id: 'c', text: 'Because external CSS has lower specificity so less work is needed.', wrongFeedback: 'Specificity affects which rule wins, not how fast files download.' },
      { id: 'd', text: 'Because external CSS skips the render-blocking phase.', wrongFeedback: 'External CSS is actually render-blocking by default — caching is the real performance win.' },
    ],
    correctId: 'b',
    correctFeedback: 'Exactly! After the first visit the browser caches the .css file, so subsequent pages load it instantly from disk instead of the network.',
  },
  {
    id: 'L1T3-Q3', type: 'mcq', topicId: 'L1T3',
    prompt: 'What is the main advantage of external CSS over embedded and inline CSS?',
    options: [
      { id: 'a', text: 'It has the highest specificity.', wrongFeedback: 'Inline CSS has the highest specificity — external CSS is actually the lowest.' },
      { id: 'b', text: 'It can style multiple HTML pages from a single file.' },
      { id: 'c', text: 'It loads faster than embedded CSS on the very first visit.', wrongFeedback: 'On first visit both must be downloaded; the performance gain comes on repeat visits via caching.' },
      { id: 'd', text: 'It supports more CSS properties than embedded CSS.', wrongFeedback: 'All three methods support exactly the same CSS properties.' },
    ],
    correctId: 'b',
    correctFeedback: 'Perfect! One external file can style an entire website. Change it once and every linked page updates — that\'s the power of separation of concerns.',
  },
  

  // Lesson 2 topic 1, Margin & Padding 
  {
    id: 'L2T1-Q1', type: 'mcq', topicId: 'L2T1',
    prompt: 'What is the key difference between margin and padding?',
    options: [
      { id: 'a', text: 'Margin adds space inside the element; padding adds space outside.', wrongFeedback: 'It\'s the opposite! Margin is outside (between elements), padding is inside (between content and border).' },
      { id: 'b', text: 'Padding adds space inside the element; margin adds space outside.' },
      { id: 'c', text: 'They are identical — just different names for the same thing.', wrongFeedback: 'They are very different. Margin is external spacing; padding is internal spacing.' },
      { id: 'd', text: 'Margin affects background color; padding does not.', wrongFeedback: 'The background fills the padding area, not the margin area — so it\'s actually the reverse.' },
    ],
    correctId: 'b',
    correctFeedback: 'Correct! Padding = space between content and border (inside). Margin = space between the element and its neighbors (outside).',
  },
  {
    id: 'L2T1-Q2', type: 'mcq', topicId: 'L2T1',
    prompt: 'What does "margin collapse" mean?',
    options: [
      { id: 'a', text: 'Margin becomes zero when the screen is too small.', wrongFeedback: 'Margin collapse has nothing to do with screen size — it\'s about adjacent vertical margins.' },
      { id: 'b', text: 'When two vertical margins meet, only the larger value applies.' },
      { id: 'c', text: 'Padding replaces margin on small screens.', wrongFeedback: 'Padding never replaces margin — they are separate properties.' },
      { id: 'd', text: 'Margin values collapse to zero when using flexbox.', wrongFeedback: 'Flexbox actually prevents margin collapse — but margin collapse itself is about adjacent block margins, not screen size.' },
    ],
    correctId: 'b',
    correctFeedback: 'Right! Margin collapse: when two vertical (block) margins meet, they merge into one — the larger of the two wins. Padding never collapses.',
  },
  {
    id: 'L2T1-Q3', type: 'mcq', topicId: 'L2T1',
    prompt: 'What does margin: 16px 32px mean?',
    options: [
      { id: 'a', text: '16px on all sides, 32px on the right only.', wrongFeedback: 'With two values the shorthand is: first value = top & bottom, second = left & right.' },
      { id: 'b', text: '16px top & bottom, 32px left & right.' },
      { id: 'c', text: '16px left & right, 32px top & bottom.', wrongFeedback: 'Remember: with two values the order is vertical (top/bottom) then horizontal (left/right).' },
      { id: 'd', text: '16px top, 32px right, 16px bottom, 32px left.', wrongFeedback: 'That would be the four-value shorthand pattern. With only two values it groups top/bottom and left/right.' },
    ],
    correctId: 'b',
    correctFeedback: 'Spot on! Two-value shorthand: first = top & bottom, second = left & right. So margin: 16px 32px means 16px vertically, 32px horizontally.',
  },

  // Lesson 2 topic 2, borders and outlines
  {
    id: 'L2T2-Q1', type: 'mcq', topicId: 'L2T2',
    prompt: 'What is the correct shorthand for setting a border?',
    options: [
      { id: 'a', text: 'border: color style width', wrongFeedback: 'The conventional order is width → style → color, matching how CSS parses the shorthand.' },
      { id: 'b', text: 'border: style color width', wrongFeedback: 'The conventional order is width → style → color.' },
      { id: 'c', text: 'border: width style color' },
      { id: 'd', text: 'border: width color style', wrongFeedback: 'The style keyword (solid/dashed/dotted) must come between width and color.' },
    ],
    correctId: 'c',
    correctFeedback: 'Correct! border: 2px solid #000 — width first, then style, then color. All three parts are needed for the border to appear.',
  },
  {
    id: 'L2T2-Q2', type: 'mcq', topicId: 'L2T2',
    prompt: 'How does an outline differ from a border?',
    options: [
      { id: 'a', text: 'Outlines take up space in the layout; borders do not.', wrongFeedback: 'It\'s the opposite — borders are part of the box model and affect layout; outlines are not.' },
      { id: 'b', text: 'Outlines are drawn outside the border without affecting layout.' },
      { id: 'c', text: 'Outlines support border-radius; borders do not.', wrongFeedback: 'Borders support border-radius (rounding corners). Outlines historically ignored border-radius in older browsers.' },
      { id: 'd', text: 'They are identical in every way.', wrongFeedback: 'They look similar but outlines don\'t affect layout and are primarily used for focus accessibility.' },
    ],
    correctId: 'b',
    correctFeedback: 'Exactly! Outlines sit outside the border box and don\'t push other elements — which is why they\'re perfect as focus ring indicators without disrupting layout.',
  },

  // Lesson 2 topic 3, box sizing
  {
    id: 'L2T3-Q1', type: 'mcq', topicId: 'L2T3',
    prompt: 'With box-sizing: content-box, an element has width: 200px and padding: 20px. What is its rendered width?',
    options: [
      { id: 'a', text: '200px', wrongFeedback: 'content-box adds padding ON TOP of the width, so the rendered width is 200 + 20 + 20 = 240px.' },
      { id: 'b', text: '180px', wrongFeedback: 'The padding is added to the width, not subtracted. Result is 240px.' },
      { id: 'c', text: '240px' },
      { id: 'd', text: '220px', wrongFeedback: 'Padding is applied to both left and right sides: 200 + 20 + 20 = 240px.' },
    ],
    correctId: 'c',
    correctFeedback: 'Correct! With content-box, padding is added outside the declared width. 200px + 20px left + 20px right = 240px total.',
  },
  {
    id: 'L2T3-Q2', type: 'mcq', topicId: 'L2T3',
    prompt: 'With box-sizing: border-box, an element has width: 200px and padding: 20px. What is its rendered width?',
    options: [
      { id: 'a', text: '240px', wrongFeedback: 'That\'s how content-box works. border-box keeps the total at exactly 200px — padding is included inside.' },
      { id: 'b', text: '200px' },
      { id: 'c', text: '160px', wrongFeedback: 'border-box doesn\'t shrink the element; it includes padding within the declared width. Total = 200px.' },
      { id: 'd', text: '180px', wrongFeedback: 'The declared width IS the total width under border-box. No subtraction needed — it\'s 200px.' },
    ],
    correctId: 'b',
    correctFeedback: 'Exactly! border-box includes padding and border inside the declared width, so the element stays at exactly 200px — much more predictable.',
  },
  {
    id: 'L2T3-Q3', type: 'mcq', topicId: 'L2T3',
    prompt: 'Why do most developers add * { box-sizing: border-box; } to every project?',
    options: [
      { id: 'a', text: 'It makes all elements the same size.', wrongFeedback: 'It doesn\'t force uniform size — it just changes HOW sizes are calculated to be more intuitive.' },
      { id: 'b', text: 'It makes sizing predictable — declared widths include padding and border.' },
      { id: 'c', text: 'It removes all default browser styles.', wrongFeedback: 'A CSS reset removes browser defaults. box-sizing: border-box only affects the width/height calculation model.' },
      { id: 'd', text: 'It prevents margin collapse between elements.', wrongFeedback: 'box-sizing has no effect on margin collapse. Flexbox or overflow hidden are the usual fixes for that.' },
    ],
    correctId: 'b',
    correctFeedback: 'Perfect! With border-box everywhere, the width you set is exactly what you get on screen. No more mental arithmetic adding up content + padding + border.',
  },

  // Lesson 3 topic 1, flex container
  {
    id: 'L3T1-Q1', type: 'mcq', topicId: 'L3T1',
    prompt: 'What CSS declaration turns an element into a flex container?',
    options: [
      { id: 'a', text: 'flex: 1', wrongFeedback: 'flex: 1 is applied to flex ITEMS to control their growth — it doesn\'t create a container.' },
      { id: 'b', text: 'display: flex' },
      { id: 'c', text: 'position: flex', wrongFeedback: '"flex" is not a valid value for position. Valid values are static, relative, absolute, fixed, sticky.' },
      { id: 'd', text: 'flex-direction: row', wrongFeedback: 'flex-direction only works on an already established flex container. You still need display: flex first.' },
    ],
    correctId: 'b',
    correctFeedback: 'Correct! display: flex on a parent makes it a flex container. All direct children automatically become flex items.',
  },
  {
    id: 'L3T1-Q2', type: 'mcq', topicId: 'L3T1',
    prompt: 'What is the default value of flex-direction?',
    options: [
      { id: 'a', text: 'column', wrongFeedback: 'column stacks items top-to-bottom. The default is row (left-to-right).' },
      { id: 'b', text: 'column-reverse', wrongFeedback: 'column-reverse stacks items bottom-to-top. The default is row.' },
      { id: 'c', text: 'row-reverse', wrongFeedback: 'row-reverse goes right-to-left. The default is the normal left-to-right row.' },
      { id: 'd', text: 'row' },
    ],
    correctId: 'd',
    correctFeedback: 'Right! By default, flex items line up in a row (left to right). You only need flex-direction if you want to change that.',
  },
  {
    id: 'L3T1-Q3', type: 'mcq', topicId: 'L3T1',
    prompt: 'Which property centers flex items along the main axis?',
    options: [
      { id: 'a', text: 'align-items', wrongFeedback: 'align-items works on the CROSS axis (perpendicular to flex-direction), not the main axis.' },
      { id: 'b', text: 'align-content', wrongFeedback: 'align-content controls spacing between wrapped rows — not centering along the main axis.' },
      { id: 'c', text: 'justify-content' },
      { id: 'd', text: 'flex-align', wrongFeedback: 'flex-align is not a real CSS property.' },
    ],
    correctId: 'c',
    correctFeedback: 'Yes! justify-content controls the main axis. Use justify-content: center to center items horizontally in a row layout (or vertically in a column layout).',
  },

  // Lesson 3 topic 2, flex items
  {
    id: 'L3T2-Q1', type: 'mcq', topicId: 'L3T2',
    prompt: 'What does flex: 1 mean on a flex item?',
    options: [
      { id: 'a', text: 'The item has a fixed width of 1px.', wrongFeedback: 'flex: 1 is shorthand for flex-grow: 1; flex-shrink: 1; flex-basis: 0 — not a pixel width.' },
      { id: 'b', text: 'The item will grow to fill available space proportionally.' },
      { id: 'c', text: 'The item will not grow or shrink.', wrongFeedback: 'flex: 0 0 auto would prevent growing and shrinking. flex: 1 actively lets the item grow.' },
      { id: 'd', text: 'The item takes up 1% of the container.', wrongFeedback: 'flex: 1 relates to proportional growth, not percentages.' },
    ],
    correctId: 'b',
    correctFeedback: 'Exactly! flex: 1 is shorthand for grow:1 shrink:1 basis:0 — the item takes its share of remaining space. If two siblings both have flex: 1, they split space equally.',
  },
  {
    id: 'L3T2-Q2', type: 'mcq', topicId: 'L3T2',
    prompt: 'Which flex property overrides align-items for a single item?',
    options: [
      { id: 'a', text: 'justify-self', wrongFeedback: 'justify-self works in CSS Grid, not flexbox. In flex, justify-content applies to the whole container.' },
      { id: 'b', text: 'flex-self', wrongFeedback: 'flex-self is not a real CSS property.' },
      { id: 'c', text: 'align-self' },
      { id: 'd', text: 'self-align', wrongFeedback: 'self-align is not a real CSS property. The correct one is align-self.' },
    ],
    correctId: 'c',
    correctFeedback: 'Correct! align-self on an individual flex item overrides the container\'s align-items for just that one element.',
  },

  // Lesson 3 topic 3, flex wrap and gap
  {
    id: 'L3T3-Q1', type: 'mcq', topicId: 'L3T3',
    prompt: 'What does flex-wrap: wrap do?',
    options: [
      { id: 'a', text: 'Forces all items onto one line no matter how wide.', wrongFeedback: 'That\'s the behaviour of flex-wrap: nowrap (the default). wrap does the opposite.' },
      { id: 'b', text: 'Allows flex items to move onto the next row when they would overflow.' },
      { id: 'c', text: 'Wraps text inside each flex item.', wrongFeedback: 'flex-wrap controls line-wrapping of ITEMS in the container, not text wrapping inside items. Use word-wrap or overflow-wrap for text.' },
      { id: 'd', text: 'Reverses the order of flex items.', wrongFeedback: 'Reversing order is done with flex-direction: row-reverse or flex-wrap: wrap-reverse.' },
    ],
    correctId: 'b',
    correctFeedback: 'Right! flex-wrap: wrap lets items flow onto a new line when there isn\'t enough room. Combined with flex: 1 1 280px, it creates responsive grids with no media queries.',
  },
  {
    id: 'L3T3-Q2', type: 'mcq', topicId: 'L3T3',
    prompt: 'What is the advantage of using gap over margins on flex items?',
    options: [
      { id: 'a', text: 'gap supports more browsers than margin.', wrongFeedback: 'margin has near-universal support; gap in flexbox became widely supported from 2021. They\'re both fine today.' },
      { id: 'b', text: 'gap only adds space between items, not on the outer edges.' },
      { id: 'c', text: 'gap is faster for the browser to render.', wrongFeedback: 'There is no meaningful rendering speed difference between gap and margin.' },
      { id: 'd', text: 'gap allows negative spacing; margin does not.', wrongFeedback: 'It\'s actually the reverse — margin supports negative values; gap does not accept negative values.' },
    ],
    correctId: 'b',
    correctFeedback: 'Perfect! gap applies space only between items, so the container edges stay clean. With margin you often need negative margins or :first-child/:last-child tricks to compensate.',
  },

  // Lesson 4 topic 1, transitions
  {
    id: 'L4T1-Q1', type: 'mcq', topicId: 'L4T1',
    prompt: 'Which CSS property creates a smooth animated change between two property values?',
    options: [
      { id: 'a', text: 'animation', wrongFeedback: 'animation uses @keyframes for multi-step sequences. transition is the lightweight option for simple A→B changes.' },
      { id: 'b', text: 'transform', wrongFeedback: 'transform changes position/scale/rotation, but it doesn\'t animate by itself — you need transition or animation for the movement.' },
      { id: 'c', text: 'transition' },
      { id: 'd', text: 'keyframe', wrongFeedback: 'keyframe (or @keyframes) defines animation steps — but the transition property is what handles simple state changes.' },
    ],
    correctId: 'c',
    correctFeedback: 'Correct! transition: property duration timing lets you animate any CSS value change smoothly — most commonly triggered by :hover or :focus.',
  },
  {
    id: 'L4T1-Q2', type: 'mcq', topicId: 'L4T1',
    prompt: 'What is the correct order for the transition shorthand?',
    options: [
      { id: 'a', text: 'duration, property, timing-function', wrongFeedback: 'The property name comes first, then duration, then timing-function.' },
      { id: 'b', text: 'property, timing-function, duration', wrongFeedback: 'Duration (e.g. 0.3s) comes before the timing function (e.g. ease).' },
      { id: 'c', text: 'property, duration, timing-function' },
      { id: 'd', text: 'timing-function, property, duration', wrongFeedback: 'The property name always comes first in the transition shorthand.' },
    ],
    correctId: 'c',
    correctFeedback: 'Yes! transition: background-color 0.3s ease — property → duration → timing. You can optionally add a delay at the end: transition: color 0.2s ease 0.1s.',
  },

  // Lesson 4 topic 2, transforms
  {
    id: 'L4T2-Q1', type: 'mcq', topicId: 'L4T2',
    prompt: 'Which transform function moves an element without affecting layout?',
    options: [
      { id: 'a', text: 'margin-top', wrongFeedback: 'margin-top does affect layout — it pushes surrounding elements. transform: translate does not.' },
      { id: 'b', text: 'position: relative + top', wrongFeedback: 'position: relative + top does shift the element visually but still affects the document flow in some ways. translate is cleaner and GPU-accelerated.' },
      { id: 'c', text: 'translate()' },
      { id: 'd', text: 'padding', wrongFeedback: 'Padding changes the box model and affects layout — it\'s not a movement tool.' },
    ],
    correctId: 'c',
    correctFeedback: 'Correct! translate() (part of the transform property) moves an element visually without affecting the layout of surrounding elements. It\'s also GPU-accelerated for smooth animation.',
  },
  {
    id: 'L4T2-Q2', type: 'mcq', topicId: 'L4T2',
    prompt: 'What does transform: scale(1.1) do to an element?',
    options: [
      { id: 'a', text: 'Moves the element 1.1px to the right.', wrongFeedback: 'Movement is done with translateX(). scale changes the SIZE of the element.' },
      { id: 'b', text: 'Rotates the element 1.1 degrees.', wrongFeedback: 'Rotation uses rotate(). scale changes the element\'s size.' },
      { id: 'c', text: 'Enlarges the element to 110% of its original size.' },
      { id: 'd', text: 'Sets the element\'s opacity to 1.1.', wrongFeedback: 'Opacity is a separate property. scale(1.1) makes the element 10% larger.' },
    ],
    correctId: 'c',
    correctFeedback: 'Exactly! scale(1) = original size, scale(1.1) = 10% bigger, scale(0.5) = half size. It\'s a great way to create subtle "pop" hover effects.',
  },

  // Lesson 4 topic 3, keyframe animations
  {
    id: 'L4T3-Q1', type: 'mcq', topicId: 'L4T3',
    prompt: 'What is the correct way to define a keyframe animation named "fadeIn"?',
    options: [
      { id: 'a', text: 'animation fadeIn { from { opacity: 0; } to { opacity: 1; } }', wrongFeedback: 'The @keyframes at-rule is required. Without @ the browser won\'t recognise it.' },
      { id: 'b', text: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }' },
      { id: 'c', text: '.fadeIn { animation: from 0 to 1; }', wrongFeedback: 'Animation values aren\'t written inside a class like that. You need @keyframes to define the steps.' },
      { id: 'd', text: 'transition: fadeIn 0.5s;', wrongFeedback: 'transition animates simple A→B changes. @keyframes is needed for named multi-step animations.' },
    ],
    correctId: 'b',
    correctFeedback: 'Right! @keyframes fadeIn defines the animation steps. Then you apply it with animation: fadeIn 0.5s ease forwards; on the element.',
  },
  {
    id: 'L4T3-Q2', type: 'mcq', topicId: 'L4T3',
    prompt: 'Which animation value makes an animation loop forever?',
    options: [
      { id: 'a', text: 'animation-repeat: always', wrongFeedback: 'animation-repeat is not a real property. The correct property is animation-iteration-count.' },
      { id: 'b', text: 'animation-iteration-count: infinite' },
      { id: 'c', text: 'animation-duration: 0', wrongFeedback: 'Setting duration to 0 makes the animation instant — it doesn\'t loop.' },
      { id: 'd', text: 'animation-fill-mode: forwards', wrongFeedback: 'fill-mode: forwards keeps the final keyframe state after the animation ends. It doesn\'t make it loop.' },
    ],
    correctId: 'b',
    correctFeedback: 'Correct! animation-iteration-count: infinite keeps the animation looping. It\'s perfect for spinners, pulse effects, and marquees.',
  },
];

/** Return all questions for a specific topic */
export function getQuestionsForTopic(topicId: string): Question[] {
  return QUESTION_BANK.filter((q) => q.topicId === topicId);
}

/** Return all questions for a set of topic IDs */
export function getQuestionsForTopics(topicIds: string[]): Question[] {
  return QUESTION_BANK.filter((q) => topicIds.includes(q.topicId));
}