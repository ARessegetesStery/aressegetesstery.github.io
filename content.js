// Content data for index.html. Edit these arrays to update the site --
// no HTML markup to write, render.js turns each entry into DOM nodes.
// Text is copied verbatim from the site's prior about.md / _config.yml.

const newsItems = [
  {
    date: "2026.07",
    html: "One paper has been accepted by SIGGRAPH Asia 2026!",
  },
  {
    date: "2026.04",
    html: "Two papers have been accepted by SIGGRAPH 2026! See you in LA this summer! :P",
  },
  {
    date: "2026.03",
    html: "I am starting my PhD at University of Utah this fall. If you are in SLC and are interested in anything related to graphics, I'm happy to have a chat! :)",
  },
];

const publications = [
  {
    venue: "ACM Transactions on Graphics (SIGGRAPH 2026)",
    image: "static/images/bsfem.png",
    title: "Efficient B-Spline Finite Elements for Cloth Simulation",
    authorsHtml:
      '<strong>Yuqi Meng</strong>, Yihao Shi, Kemeng Huang, Zixuan Lu, Ning Guo, Taku Komura, Yin Yang, Minchen Li',
    links: [
      { label: "Project", href: "https://simulation-intelligence.github.io/BS-Cloth/" },
      { label: "Paper", href: "https://dl.acm.org/doi/10.1145/3811278" },
      { label: "Code", href: "https://github.com/Simulation-Intelligence/BS-Cloth" },
    ],
  },
  {
    venue: "ACM Transactions on Graphics (SIGGRAPH 2026)",
    image: "static/images/jgs2-gq.png",
    title: "JGS2-GQ: Training-free 2nd Jacobi with Gaussian Quadrature",
    authorsHtml:
      'Dewen Guo, Zixuan Lu, Zhiyong He, <strong>Yuqi Meng</strong>, Bohan Wang, Lei Lan, Weiwei Xu, Chenfanfu Jiang, Yin Yang',
    links: [
      { label: "Paper", href: "https://dl.acm.org/doi/10.1145/3811274" },
    ],
  },
  {
    venue: "SIGGRAPH Asia 2023 (Conference)",
    image: "static/images/rt-octree.png",
    title:
      "RT-Octree: Accelerate PlenOctree Rendering with Batched Regular Tracking and Neural Denoising for Real-time Neural Radiance Fields",
    authorsHtml:
      'Zixi Shu, Ran Yi, <strong>Yuqi Meng</strong>, Yutong Wu, Lizhuang Ma',
    links: [
      { label: "Project", href: "https://rt-octree.github.io/" },
      { label: "Paper", href: "https://dl.acm.org/doi/10.1145/3610548.3618214" },
      { label: "Code", href: "https://github.com/LumiOwO/RT-Octree" },
    ],
  },
];

const education = [
  { date: "2025.07 – (now)", html: "Research Assistant, University of Utah" },
  { date: "2023.09 – 2025.05", html: "Undergraduate, University of Michigan." },
  { date: "2021.09 – 2025.08", html: "Undergraduate, Shanghai Jiao Tong University." },
];

const teaching = [
  {
    role: "Instructor Aide, University of Michigan",
    items: [
      {
        date: "Winter 2025",
        html: 'EECS 498-014: Graphics and Generative Models. (Course development) [<a href="https://um-graphics.github.io/">course website</a>] Instructor: <a href="https://jjparkcv.github.io/">Jeong Joon Park</a>',
      },
    ],
  },
  {
    role: "Teaching Assistant, Shanghai Jiao Tong University",
    items: [
      {
        date: "Summer 2023",
        html: 'ENGR1000J: Introduction to Engineering (Software Engineering). Instructor: <a href="https://gc.sjtu.edu.cn/about/faculty-staff/faculty-directory/faculty-detail/76/">Manuel Charlemagne</a>',
      },
      {
        date: "Fall 2022, Spring 2023",
        html: 'MATH2140J/MATH4170J: Linear Algebra. Instructor: <a href="https://gc.sjtu.edu.cn/about/faculty-staff/faculty-directory/faculty-detail/76/">Manuel Charlemagne</a>',
      },
    ],
  },
];

// Misc — free-form list. Add entries as { html: "..." } and each renders as a
// line under the Misc section (HTML, including <a> links, is allowed). While
// this array is empty, the whole Misc section and its nav link stay hidden --
// see renderMisc in render.js.
const misc = [
  {
    html:
      'Although I deep-dive in computer science, I also find math particularly ' +
      'intriguing. During my undergraduate years, I maintained ' +
      '<a href="https://github.com/ARessegetesStery/Course-Notes" target="_blank" rel="noopener noreferrer">these notes</a> ' +
      'when studying abstract algebra, a subject that appears obscure yet ' +
      'reflects the delicate structure of mathematics. Feel free to grab them, ' +
      'and I would be very glad if they are to any extent helpful.',
  },
  {
    html:
      'Besides academics, I also have artistic pursuits. Check out my ' +
      '<a href="https://arias-alcta.bandcamp.com/" target="_blank" rel="noopener noreferrer">Bandcamp</a> ' +
      'for my past music productions. There are many more works on the way :)',
  },
];
