import type { Lesson } from '../types/course';

export const COURSE: Lesson[] = [
  {
    id: 'L1',
    title: 'CSS Formatting',
    subtitle: 'Lesson 1',
    duration: '30 min',
    difficulty: 'Beginner',
    color: '#C8A97E',
    topics: [
      {
        id: 'L1T1',
        title: 'Inline CSS',
        duration: '8 min',
        content: {
          intro:
            `<i><b>There are 3 types of CSS: inline, embedded, and external.</b></i><br /><br />
            
            Inline CSS applies styles directly inside a single HTML element using the <code>style</code> attribute.
            It has the highest specificity but is the hardest to maintain.`,
          sections: [
            {
              heading: 'What is Inline CSS?',
              body: `Inline CSS means writing your styles as an attribute value inside the HTML tag itself. For example: <code>&lt;p style="color: red"&gt;Hello&lt;/p&gt;</code>. 
              This overrides any external or embedded styles for that specific element. 
              It is also important to note that the scope of inline CSS is only the tag in which you use it on (and any child tags if you included inheritted CSS)!`,
            },
            {
              heading: 'When to Use It',
              body: 'This type of CSS is best for quick <i>one-off</i> overrides, dynamically-generated styles via JavaScript, Rapid prototyping, or overriding specific elements to name a few cases. <br />Again, <b> The scope of inline CSS is the smallest of the 3 types, as it only applies to the individual tag (and sometimes its child tags) its applied on</b> <br/>The downside of this type of CSS especially is that it can get out of control quickly and the user will have to hunt down every instance of CSS if they want to change several of them. ',
            },
            {
              heading: 'Limitations',
              body: "Like mentioned already, inline styles do not scale very well because of their individual nature. They also mix structure (HTML) with presentation (CSS), can't use pseudo-classes like <code>:hover</code>, and make your markup bloated. If your goal is to apply <b>the same CSS to  several tags</b>, this is not the best form of CSS to use. ",
            },
          ],
          example: `<!-- Inline CSS Example -->

            <h1 style="color: #2B2B2B; font-family: Georgia;">
              Hello World
              
            </h1>
<!-- the color and font specified in the h1 tag does not apply to the p tag, only to itself. -->

            <p style="line-height: 1.6;">
              This paragraph has inline styles.
            </p>`,
        },
      },
      {
        id: 'L1T2',
        title: 'Embedded CSS',
        duration: '8 min',
        content: {
          intro:
            `Embedded (or internal) CSS is written inside a <code>&lt;style&gt;</code> tag in the <code>&lt;head&gt;</code> section of an HTML document. It applies to that page only. This also means the scope of embedded CSS is also one page. 
            <br />
            We will also be going over topics like element selectors and class selectors in this lecture`,

            
          sections: [
            {
              heading: 'What is Embedded CSS?',
              body: `You place a <code>&lt;style&gt;</code> block inside the <code>&lt;head&gt;</code> of your HTML file. All selectors and rules written there apply only to that single HTML page. 
                      Embedded CSS also has an interesting feature that inline CSS is not capable of: Element Selectors and Class Selectors
                      <br/><br/>
                      <b>Element selectors:</b> This is when you change the rules for an existing HTML tag directly. You can change the rules for existing tags like <code>&lt;h1&gt;</code> as an example.<br/>
                      <b>Class Selectors:</b> This is when you create a custom style starting with a dot, you can then apply this CSS into tags via the class attribute. They also have a higher specificity than element selectors (which means they can override them) <br/><br/>
                    In embedded CSS, you can redefine element selectors or you can create class selectors to apply to the tags in your file `,
            },
            {
              heading: 'Advantages',
              body: "Embedded styles are great for single-page projects or prototypes because you can still define CSS without having to make a separate page or use inline CSS on all your tags. They're in one file, load immediately, and let you use the most important features of CSS- including pseudo-classes, tag and class selectors, media queries, and animations.",
            },
            {
              heading: 'Disadvantages',
              body: `They don't scale across multiple pages. If you want the same styles on 10 pages, you'd have to copy the <code>&lt;style&gt;</code> block 10 times.... OR use external CSS which is your next topic in the lesson !
              
                      It is also important to note that embedded CSS has a lower sepcificity than inline CSS, which essentially means if embedded CSS and inline CSS were added to the same tag and both had the same properties, inline would override the embedded CSS`,
            },
          ],
          example: `<head>
  <style>
    body {
      font-family: Georgia, serif;
      background: #f8f7f4;
    }

    h1 {
      color: #2B2B2B;
      font-size: 2rem;
    }

    
    .exampleClassSelector{
        color: #d5a1ea;
        background-color: #990044;
        font-size: 4vw;
    }
  </style>
</head>
<body>

<!-- it is also good to note here that if this was an h1 tag and had the exampleClassSelector class on it too, 
the color would be #d5a1ea because it would override the element selector... 
BUT if inline css was also applied, the inline css would override the class selector ! -->

<div class="exampleClassSelector"></div>

</body>

`,
        },
      },
      {
        id: 'L1T3',
        title: 'External CSS',
        duration: '10 min',
        content: {
          intro:
            'External CSS is the most powerful and scalable method — styles live in a separate <code>.css</code> file and are linked to any HTML page that needs them.',
          sections: [
            {
              heading: 'How External CSS Works',
              body: 'You create a file like <code>styles.css</code>, write all your rules there, then link it in HTML with: <code>&lt;link rel="stylesheet" href="styles.css"&gt;</code>.',
            },
            {
              heading: "Why It's Best Practice",
              body: "Separation of concerns: your HTML handles structure, CSS handles appearance. One stylesheet can style hundreds of pages. Browsers also cache the CSS file, so pages load faster on repeat visits.",
            },
            {
              heading: 'File Organization',
              body: 'Keep your CSS file(s) in a dedicated folder (e.g. <code>/css/</code>). For larger projects, split into multiple files: <code>base.css</code>, <code>layout.css</code>, <code>components.css</code>.',
            },
          ],
          example: `/* styles.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: #F8F7F4;
  color: #2B2B2B;
}

/* In your HTML: */
<link rel="stylesheet" href="styles.css">`,
        },
      },
    ],
  },
  {
    id: 'L2',
    title: 'CSS Box Model',
    subtitle: 'Lesson 2',
    duration: '40 min',
    difficulty: 'Beginner',
    color: '#7EAB9A',
    topics: [
      {
        id: 'L2T1',
        title: 'Margin & Padding',
        duration: '12 min',
        content: {
          intro:
            'Margin and padding are the core spacing tools in CSS. Margin controls space <em>outside</em> an element; padding controls space <em>inside</em> it.',
          sections: [
            {
              heading: 'Margin',
              body: "Margin creates space between elements. It is transparent — it shows the parent's background. Use <code>margin: top right bottom left</code> or shorthand like <code>margin: 16px</code> for all sides.",
            },
            {
              heading: 'Padding',
              body: "Padding creates space between an element's content and its border. The element's background color fills the padding area. Use <code>padding: 12px 24px</code> for vertical/horizontal shorthand.",
            },
            {
              heading: 'Margin Collapse',
              body: 'When two vertical margins meet, they collapse into one — only the larger value applies. This only happens with block-level elements and does not occur with padding.',
            },
          ],
          example: `.card {
  margin: 24px auto;      /* top/bottom 24px, centered */
  padding: 16px 24px;     /* 16px top/bottom, 24px left/right */
  background: white;
}

/* Individual sides */
.box {
  margin-top: 8px;
  padding-left: 16px;
}`,
        },
      },
      {
        id: 'L2T2',
        title: 'Borders & Outlines',
        duration: '10 min',
        content: {
          intro:
            "Borders wrap around an element's padding and content. Outlines are similar but don't affect layout — they're drawn outside the border without taking space.",
          sections: [
            {
              heading: 'Border Syntax',
              body: 'Use the shorthand: <code>border: width style color</code>. For example: <code>border: 2px solid #2B2B2B</code>. You can also target individual sides: <code>border-top</code>, <code>border-left</code>, etc.',
            },
            {
              heading: 'Border Radius',
              body: '<code>border-radius</code> rounds the corners of an element. <code>border-radius: 8px</code> gives a subtle curve; <code>border-radius: 50%</code> makes circles.',
            },
            {
              heading: 'Outline',
              body: 'Outlines are used mainly for accessibility (focus indicators). Unlike borders, they do not affect the layout box. Never remove focus outlines without a replacement.',
            },
          ],
          example: `.button {
  border: 2px solid #2B2B2B;
  border-radius: 12px;
  padding: 10px 20px;
}

.button:focus {
  outline: 3px solid #9A7B4F;
  outline-offset: 2px;
}

.avatar {
  border-radius: 50%;
  border: 3px solid white;
}`,
        },
      },
      {
        id: 'L2T3',
        title: 'Box Sizing',
        duration: '8 min',
        content: {
          intro:
            '<code>box-sizing</code> determines how the total width and height of an element is calculated — one of the most important CSS fundamentals.',
          sections: [
            {
              heading: 'content-box (default)',
              body: 'Width and height only apply to the content. Padding and border are added on top. A 200px element with 20px padding becomes 240px wide — often surprising.',
            },
            {
              heading: 'border-box (recommended)',
              body: 'Width and height include padding and border. A 200px element stays 200px total. Much more predictable — why most projects start with <code>* { box-sizing: border-box; }</code>.',
            },
            {
              heading: 'The Universal Reset',
              body: 'Add this to every project: <code>*, *::before, *::after { box-sizing: border-box; }</code>. It makes sizing intuitive across the board.',
            },
          ],
          example: `/* Universal reset — always include this */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Now this is exactly 300px wide, including padding */
.container {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
}`,
        },
      },
    ],
  },
  {
    id: 'L3',
    title: 'CSS Flexbox',
    subtitle: 'Lesson 3',
    duration: '50 min',
    difficulty: 'Intermediate',
    color: '#8A7EC8',
    topics: [
      {
        id: 'L3T1',
        title: 'Flex Container',
        duration: '15 min',
        content: {
          intro:
            'Flexbox is a one-dimensional layout system. The <strong>flex container</strong> is the parent element — set <code>display: flex</code> on it to activate flexbox for its children.',
          sections: [
            {
              heading: 'display: flex',
              body: 'Turning an element into a flex container makes all its direct children into flex items. They line up in a row by default and respond to flex properties.',
            },
            {
              heading: 'flex-direction',
              body: 'Controls the main axis direction: <code>row</code> (default), <code>row-reverse</code>, <code>column</code>, or <code>column-reverse</code>.',
            },
            {
              heading: 'justify-content & align-items',
              body: '<code>justify-content</code> aligns items along the main axis (flex-start, center, space-between). <code>align-items</code> aligns them on the cross axis (stretch, center, flex-start, flex-end).',
            },
          ],
          example: `.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}`,
        },
      },
      {
        id: 'L3T2',
        title: 'Flex Items',
        duration: '15 min',
        content: {
          intro:
            'Flex items are the direct children of a flex container. They have their own set of properties that control how they grow, shrink, and are sized within the container.',
          sections: [
            {
              heading: 'flex-grow',
              body: '<code>flex-grow: 1</code> lets an item expand to fill available space. If all items have <code>flex-grow: 1</code>, they share space equally. Higher values claim proportionally more.',
            },
            {
              heading: 'flex-shrink',
              body: '<code>flex-shrink</code> controls how items shrink when there is not enough space. Default is 1 (can shrink). Set to 0 to prevent an item from ever shrinking.',
            },
            {
              heading: 'flex-basis & align-self',
              body: '<code>flex-basis</code> sets the initial size before growing/shrinking. <code>align-self</code> overrides <code>align-items</code> for a single item.',
            },
          ],
          example: `.sidebar {
  flex: 0 0 280px;  /* grow:0 shrink:0 basis:280px */
}

.content {
  flex: 1;          /* grows to fill remaining space */
  min-width: 0;     /* prevents overflow issues */
}

.special-item {
  align-self: flex-end;
}`,
        },
      },
      {
        id: 'L3T3',
        title: 'Flex Wrap & Gap',
        duration: '12 min',
        content: {
          intro:
            '<code>flex-wrap</code> and <code>gap</code> are essential for building responsive flex layouts without media queries for every breakpoint.',
          sections: [
            {
              heading: 'flex-wrap',
              body: 'By default, flex items try to fit on one line (nowrap). <code>flex-wrap: wrap</code> lets items move to the next row when they would overflow.',
            },
            {
              heading: 'gap',
              body: '<code>gap</code> adds consistent spacing between flex items. Cleaner than using margins because it only applies between items, not on outer edges.',
            },
            {
              heading: 'align-content',
              body: 'When items wrap to multiple lines, <code>align-content</code> controls spacing between those rows.',
            },
          ],
          example: `.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card {
  flex: 1 1 280px; /* grow, shrink, min-width 280px */
}

.multi-row {
  align-content: space-between;
}`,
        },
      },
    ],
  },
  {
    id: 'L4',
    title: 'CSS Movement & Animation',
    subtitle: 'Lesson 4',
    duration: '55 min',
    difficulty: 'Intermediate',
    color: '#C87E8A',
    topics: [
      {
        id: 'L4T1',
        title: 'Transitions',
        duration: '15 min',
        content: {
          intro:
            'CSS transitions animate a property change smoothly over time. They activate when a property value changes — often on <code>:hover</code>, <code>:focus</code>, or class changes via JS.',
          sections: [
            {
              heading: 'transition syntax',
              body: 'Use <code>transition: property duration timing-function delay</code>. For example: <code>transition: background-color 0.3s ease</code>. Transition multiple properties by separating with commas.',
            },
            {
              heading: 'Timing Functions',
              body: 'Control the speed curve: <code>ease</code> (default), <code>linear</code>, <code>ease-in</code>, <code>ease-out</code>, <code>ease-in-out</code>, or a custom <code>cubic-bezier()</code>.',
            },
            {
              heading: 'What Can Be Transitioned',
              body: 'Most numeric CSS properties can be transitioned: color, opacity, transform, width, height, padding, border-radius. Avoid transitioning <code>display</code> — use <code>opacity</code> + <code>visibility</code> instead.',
            },
          ],
          example: `.button {
  background: #2B2B2B;
  transition: background 0.25s ease, transform 0.2s ease;
}

.button:hover {
  background: #9A7B4F;
  transform: translateY(-2px);
}

.card {
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
  transform: translateY(12px);
}
.card.visible {
  opacity: 1;
  transform: translateY(0);
}`,
        },
      },
      {
        id: 'L4T2',
        title: 'Transforms',
        duration: '15 min',
        content: {
          intro:
            "CSS transforms let you translate, rotate, scale, and skew elements without affecting layout. They're GPU-accelerated — perfect for smooth animations.",
          sections: [
            {
              heading: 'translate',
              body: '<code>translate(x, y)</code> moves an element. <code>translateX(20px)</code> moves right; <code>translateY(-10px)</code> moves up. Use percentages to move relative to the element\'s own size.',
            },
            {
              heading: 'scale & rotate',
              body: '<code>scale(1.05)</code> slightly enlarges; <code>scale(0)</code> hides. <code>rotate(45deg)</code> spins. Combine with transition for smooth hover effects.',
            },
            {
              heading: 'transform-origin',
              body: '<code>transform-origin</code> sets the pivot point for rotations and scales. Default is <code>center</code>. Use <code>transform-origin: top left</code> to rotate from a corner.',
            },
          ],
          example: `.card:hover {
  transform: translateY(-4px) scale(1.02);
}

.icon-spin:hover {
  transform: rotate(180deg);
  transition: transform 0.4s ease;
}

.flip-card {
  transform: rotateY(180deg);
  transform-origin: center;
  transform-style: preserve-3d;
}`,
        },
      },
      {
        id: 'L4T3',
        title: 'Keyframe Animations',
        duration: '18 min',
        content: {
          intro:
            '<code>@keyframes</code> let you define multi-step animations that play automatically — not just on hover. You name the animation, define stages, then apply it with <code>animation</code>.',
          sections: [
            {
              heading: '@keyframes syntax',
              body: 'Define steps using percentages (0% to 100%) or keywords <code>from</code> and <code>to</code>. Each step defines the CSS state at that point in the animation timeline.',
            },
            {
              heading: 'animation shorthand',
              body: '<code>animation: name duration timing iteration direction fill-mode</code>. Use <code>infinite</code> for looping animations like spinners.',
            },
            {
              heading: 'animation-delay & stagger',
              body: 'Use <code>animation-delay</code> to stagger items. Apply the same animation to multiple elements with increasing delays to create cascading reveal effects.',
            },
          ],
          example: `@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

.hero-text {
  animation: fadeSlideUp 0.6s ease forwards;
}

.loader {
  animation: pulse 1.5s ease-in-out infinite;
}`,
        },
      },
    ],
  },
];