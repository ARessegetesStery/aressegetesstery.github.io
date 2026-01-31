---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Hi! This is Yuqi Meng (*yoo-chee mung*). I also go by Arias.

I am currently a research assistant at [University of Utah](http://www.utah.edu/), advised by [Prof. Yin Yang](https://yangzzzy.github.io/). Before that, I received my B.S.E. in Computer Science from [University of Michigan](https://umich.edu/) and B.E. in Electrical and Computer Engineering from [Shanghai Jiao Tong University](https://www.sjtu.edu.cn/). During my undergraduate years, I was very fortunate to be advised by [Prof. Minchen Li](https://www.cs.cmu.edu/~minchenl/), who introduced me to the field of physics simulation in computer graphics.

My research interest includes developing robust and efficient computing methods for physics-based simulation. Still exploring :)

<!-- My research interest includes neural machine translation and computer vision. I have published more than 100 papers at the top international AI conferences with total <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'>google scholar citations <strong><span id='total_cit'>260000+</span></strong></a> (You can also use google scholar badge <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'><img src="https://img.shields.io/endpoint?url={{ url | url_encode }}&logo=Google%20Scholar&labelColor=f6f6f6&color=9cf&style=flat&label=citations"></a>). -->


<!-- # 🔥 News -->
<!-- - *2026.01*:  -->
<!-- - *2022.02*: &nbsp;🎉🎉 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  -->

# Publications 

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">SIGGRAPH Asia 2023 (Conference)</div><img src='images/rt-octree.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

RT-Octree: Accelerate PlenOctree Rendering with Batched Regular Tracking and Neural Denoising for Real-time Neural Radiance Fields

Zixi Shu, Ran Yi, **Yuqi Meng**, Yutong Wu, Lizhuang Ma

[**Project**](https://rt-octree.github.io/) | [**Paper**](https://dl.acm.org/doi/10.1145/3610548.3618214) | [**Code**](https://github.com/LumiOwO/RT-Octree)
</div>
</div>


# Educations
- *2025.07 - (now)*, Research Assistant, University of Utah 
- *2023.09 - 2025.05*, Undergraduate, University of Michigan. 
- *2021.09 - 2025.08*, Undergraduate, Shanghai Jiao Tong University. 

# Teaching

## *Instructor Aide*, University of Michigan
- EECS 498-014: Graphics and Generative Models. (Course development, Winter 2025) [[course website](https://um-graphics.github.io/)] Insturctor: [Jeong Joon Park](https://jjparkcv.github.io/)

## *Teaching Assistant*, Shanghai Jiao Tong University
- ENGR1000J: Introduction to Engineering (Software Engineering). (Summer 2023) Instructor: [Manuel Charlemagne](https://gc.sjtu.edu.cn/about/faculty-staff/faculty-directory/faculty-detail/76/)
- MATH2140J/MATH4170J: Linear Algebra. (Fall 2022, Spring 2023) Instructor: [Manuel Charlemagne](https://gc.sjtu.edu.cn/about/faculty-staff/faculty-directory/faculty-detail/76/)
