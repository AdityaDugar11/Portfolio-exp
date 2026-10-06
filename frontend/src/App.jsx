import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import RepoGraph from './RepoGraph.jsx'

const FlowGuardVisual = () => {
  const svgRef = useRef(null)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to('.signal-line', {
        strokeDashoffset: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current.closest('.section'),
          start: 'top top',
          end: '+=400%',
          scrub: 1
        }
      })
      gsap.to('.decision-node', {
        rotation: 180,
        transformOrigin: '50% 50%',
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current.closest('.section'),
          start: 'top top',
          end: '+=400%',
          scrub: 1.5
        }
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <pattern id="grid1" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid1)" />

      <path d="M 100 150 L 200 150 L 250 100 L 350 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M 100 150 L 200 150 L 250 200 L 350 200" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      <path className="signal-line" d="M 100 150 L 200 150 L 250 100 L 350 100" fill="none" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="5 15" />
      <path className="signal-line" d="M 100 150 L 200 150 L 250 200 L 350 200" fill="none" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="5 15" />

      <circle cx="100" cy="150" r="3" fill="#fff" />
      <circle cx="350" cy="100" r="3" fill="#fff" />
      <circle cx="350" cy="200" r="3" fill="var(--accent-color)" />

      <g className="decision-node">
        <rect x="180" y="130" width="40" height="40" fill="#0a0a0a" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="185" y="135" width="30" height="30" fill="none" stroke="var(--accent-color)" strokeWidth="1" />
      </g>
    </svg>
  )
}

const SchemeMatcherVisual = () => {
  const svgRef = useRef(null)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to('.match-ring', {
        scale: 1.5,
        opacity: 0,
        transformOrigin: '50% 50%',
        repeat: -1,
        duration: 2,
        ease: 'power1.out',
      })
      gsap.to('.network-line', {
        strokeDashoffset: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current.closest('.section'),
          start: 'top top',
          end: '+=400%',
          scrub: 1
        }
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <path className="network-line" d="M 100 50 Q 200 150 300 150" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 8" />
      <path className="network-line" d="M 100 250 Q 200 150 300 150" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 8" />
      <path className="network-line" d="M 150 150 L 300 150" fill="none" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="2 6" />

      <circle cx="100" cy="50" r="4" fill="none" stroke="#fff" strokeWidth="1" />
      <circle cx="100" cy="250" r="4" fill="none" stroke="#fff" strokeWidth="1" />
      <circle cx="150" cy="150" r="4" fill="none" stroke="#fff" strokeWidth="1" />

      <circle cx="300" cy="150" r="10" fill="none" stroke="var(--accent-color)" strokeWidth="1" />
      <circle className="match-ring" cx="300" cy="150" r="10" fill="none" stroke="var(--accent-color)" strokeWidth="1" />
      <rect x="297" y="147" width="6" height="6" fill="#fff" />
    </svg>
  )
}

const FAQVisual = () => {
  const svgRef = useRef(null)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to('.doc-layer', {
        y: (i) => i * 10 - 5,
        x: (i) => i * 10 - 5,
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current.closest('.section'),
          start: 'top top',
          end: '+=400%',
          scrub: 1.5
        }
      })
      gsap.to('.query-line', {
        x: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current.closest('.section'),
          start: 'top top',
          end: '+=400%',
          scrub: 1
        }
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <g transform="translate(250, 100)">
        {[0, 1, 2].map(i => (
          <rect key={i} className="doc-layer" x={i * 5} y={i * 5} width="50" height="70" fill="#0a0a0a" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        ))}
        <rect className="doc-layer" x="15" y="15" width="50" height="70" fill="#0a0a0a" stroke="var(--accent-color)" strokeWidth="1" />
        <line className="doc-layer" x1="25" y1="30" x2="55" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line className="doc-layer" x1="25" y1="40" x2="45" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </g>

      <rect x="80" y="130" width="60" height="15" fill="none" stroke="#fff" strokeWidth="1" />
      <line x1="90" y1="137" x2="110" y2="137" stroke="#fff" strokeWidth="1" />

      <g transform="translate(140, 137)">
        <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <rect className="query-line" x="0" y="-1.5" width="15" height="3" fill="var(--accent-color)" />
      </g>
    </svg>
  )
}

const AgriVisionVisual = () => {
  const svgRef = useRef(null)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to('.scan-line', {
        y: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current.closest('.section'),
          start: 'top top',
          end: '+=400%',
          scrub: 2
        }
      })
      gsap.to('.terrain-point', {
        scale: 1.5,
        opacity: 0,
        transformOrigin: '50% 50%',
        repeat: -1,
        duration: 1.5,
        stagger: 0.5
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <g transform="translate(200, 70) scale(1, 0.5) rotate(45)">
        {[...Array(8)].map((_, i) => (
          <line key={`h-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="140" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={`v-${i}`} x1="0" y1={i * 20} x2="140" y2={i * 20} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}

        <rect x="40" y="40" width="40" height="40" fill="none" stroke="var(--accent-color)" strokeWidth="1" />

        <circle className="terrain-point" cx="60" cy="60" r="3" fill="var(--accent-color)" />
        <circle className="terrain-point" cx="100" cy="100" r="3" fill="#fff" />
      </g>

      <line className="scan-line" x1="0" y1="80" x2="400" y2="80" stroke="var(--accent-color)" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

const GenericVisual = () => {
  const svgRef = useRef(null)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to('.gen-box', {
        rotation: 360,
        transformOrigin: '50% 50%',
        repeat: -1,
        duration: 10,
        ease: 'none'
      })
      gsap.to('.gen-line', {
        strokeDashoffset: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: svgRef.current.closest('.section'),
          start: 'top top',
          end: '+=400%',
          scrub: 1
        }
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect x="150" y="100" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect className="gen-box" x="175" y="125" width="50" height="50" fill="none" stroke="var(--accent-color)" strokeWidth="1" />
      <path className="gen-line" d="M 0 150 L 150 150 M 250 150 L 400 150" fill="none" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="5 10" />
    </svg>
  )
}

const LeadQualificationVisual = () => {
  const svgRef = useRef(null)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.to('.lead-pulse', {
        scale: 1.5, opacity: 0, transformOrigin: '50% 50%', repeat: -1, duration: 1.5
      })
      gsap.to('.signal-path', {
        strokeDashoffset: -20, ease: 'none', scrollTrigger: { trigger: svgRef.current.closest('.section'), start: 'top top', end: '+=400%', scrub: 1 }
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])
  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <circle className="lead-pulse" cx="80" cy="150" r="15" fill="none" stroke="var(--accent-color)" strokeWidth="1" />
      <circle cx="80" cy="150" r="5" fill="#fff" />

      <path className="signal-path" d="M 100 150 Q 150 100 200 150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 8" />
      <path className="signal-path" d="M 100 150 L 200 150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 8" />
      <path className="signal-path" d="M 100 150 Q 150 200 200 150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 8" />

      <rect x="200" y="125" width="50" height="50" fill="#0a0a0a" stroke="var(--accent-color)" strokeWidth="1" />

      <path className="signal-path" d="M 250 150 L 320 120" fill="none" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="5 10" />
      <path className="signal-path" d="M 250 150 L 320 180" fill="none" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="5 10" />

      <rect x="320" y="110" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1" />
      <rect x="320" y="170" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1" />
    </svg>
  )
}

const ContentGenerationVisual = () => {
  const svgRef = useRef(null)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.to('.gen-progress', {
        width: 60, ease: 'none', scrollTrigger: { trigger: svgRef.current.closest('.section'), start: 'top top', end: '+=400%', scrub: 1 }
      })
      gsap.to('.publish-wave', {
        scale: 1.5, opacity: 0, transformOrigin: '50% 50%', repeat: -1, duration: 2
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])
  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <line x1="50" y1="150" x2="90" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <rect x="90" y="130" width="40" height="40" rx="4" fill="none" stroke="#fff" strokeWidth="1" />
      <line x1="100" y1="140" x2="120" y2="140" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <line x1="100" y1="150" x2="115" y2="150" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

      <line x1="130" y1="150" x2="190" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <rect className="gen-progress" x="130" y="149" width="0" height="2" fill="var(--accent-color)" />

      <polygon points="190,130 230,130 230,170 190,170" fill="none" stroke="var(--accent-color)" strokeWidth="1" />
      <circle cx="210" cy="150" r="10" fill="none" stroke="var(--accent-color)" strokeWidth="1" />

      <line x1="230" y1="150" x2="290" y2="150" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 6" />

      <circle cx="310" cy="150" r="15" fill="#fff" />
      <circle className="publish-wave" cx="310" cy="150" r="15" fill="none" stroke="#fff" strokeWidth="1" />
    </svg>
  )
}

const ProjectVisual = ({ project }) => {
  switch (project.visualType) {
    case 'fintech-risk':
      return <FlowGuardVisual />;
    case 'scheme-matching':
      return <SchemeMatcherVisual />;
    case 'rag-support':
      return <FAQVisual />;
    case 'computer-vision':
      return <AgriVisionVisual />;
    case 'lead-qualification':
      return <LeadQualificationVisual />;
    case 'content-generation':
      return <ContentGenerationVisual />;
    case 'generic-ai':
    default:
      return <GenericVisual />;
  }
}

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'FlowGuard AI',
    category: 'AGENTIC FINTECH',
    description: 'AI-powered payment orchestration platform with real-time fraud detection, intelligent payment routing, and an AI decision layer.',
    tech: ['React', 'FastAPI', 'Python', 'OpenRouter', 'Scikit-learn'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    github: 'https://github.com/AdityaDugar11/FlowGuard-AI'
  },
  {
    id: 2,
    title: 'SchemeMatcher',
    category: 'AI PLATFORM',
    description: 'AI-powered platform that matches entrepreneurs with relevant government schemes using profile-based eligibility reasoning and application tracking.',
    tech: ['React', 'Vite', 'FastAPI', 'Gemini', 'Supabase'],
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    github: 'https://github.com/AdityaDugar11/SIH-AI-Driven-Scheme-Matching-for-Marginalized-Entrepreneurs'
  },
  {
    id: 3,
    title: 'FAQ RAG Support Agent',
    category: 'RAG AUTOMATION',
    description: 'AI customer-support system that answers FAQs, escalates complex queries to human agents, and logs interactions through automation workflows.',
    tech: ['RAG', 'n8n', 'Groq', 'Slack', 'Airtable'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    github: 'https://github.com/AdityaDugar11/FAQ-RAG-Support-Agent'
  },
  {
    id: 4,
    title: 'AgriVision Pro',
    category: 'AGRICULTURAL AI',
    description: 'Multilingual agricultural advisory prototype connecting farmers with crop-disease guidance and WhatsApp-based assistance.',
    tech: ['FastAPI', 'PostgreSQL', 'Hugging Face', 'Twilio', 'Docker'],
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    github: 'https://github.com/AdityaDugar11/AgriVision-Pro'
  }
];

function App() {
  const [projectsData, setProjectsData] = React.useState([]);
  const [reposData, setReposData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [reposLoading, setReposLoading] = React.useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then(data => {
        setProjectsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProjectsData(FALLBACK_PROJECTS);
        setLoading(false);
      });
      
    fetch('/api/repositories')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setReposData(data);
        setReposLoading(false);
      })
      .catch(err => {
        console.error(err);
        setReposLoading(false);
      });
  }, []);

  const heroRef = useRef(null)
  const headlineRef = useRef(null)
  const aboutRef = useRef(null)
  const aboutDescRef = useRef(null)
  const workRef = useRef(null)
  const experimentsRef = useRef(null)
  const impactStatementRef = useRef(null)
  const impactStatementDescRef = useRef(null)
  const impactPointsRef = useRef(null)
  const experienceRef = useRef(null)
  const skillsRef = useRef(null)
  const hackathonsRef = useRef(null)
  const contactRef = useRef(null)
  const scrollIndicatorRef = useRef(null)

  const hackathonsData = [
    {
      id: 'inceptrix-2026',
      event: '01 — INCEPTRIX 2026',
      name: 'CAMPUS CONNECT',
      role: 'TEAM MATRIX',
      description: 'A college-only social network designed to solve fragmented campus communication and student connection problems. Key features include: Campus Feed, First-Year Friendship Match, Events Hub, Marketplace, Lost & Found, Notes & Study Help, and University Map & Info.',
      tech: ['AI', 'Rapid Prototyping', 'Full-Stack Development', 'Deployment', 'Problem Solving']
    },
    {
      id: 'grinova',
      event: '02 — GRINOVA HACKATHON',
      name: 'AGRIVISION PRO',
      role: 'TEAM MATRIX',
      description: 'Tackled green innovation challenges with an AI-powered sustainability platform. Showcased full-stack development and machine learning integration under competitive constraints.',
      tech: ['AI', 'Sustainability', 'Full-Stack Development', 'Machine Learning', 'Rapid Development']
    },
    {
      id: 'sih-2026',
      event: '03 — SMART INDIA HACKATHON 2026',
      name: 'SCHEMEMATCHER',
      role: 'PRIMARY CONTRIBUTOR — FRONTEND + BACKEND',
      description: 'AI-powered platform that matches marginalized entrepreneurs with relevant government schemes and financial assistance based on their profile.',
      tech: ['React', 'Vite', 'Tailwind CSS', 'FastAPI', 'Python', 'Google Gemini', 'Supabase']
    },
    {
      id: 'flowguard-devcraft-2026',
      event: '04 — DEVCRAFT HACKATHON 2026',
      name: 'FLOWGUARD AI',
      role: 'PARTICIPANT — FINTECH TRACK',
      description: 'AI-powered payment orchestration platform that detects fraud in real-time, optimizes payment routes, and provides personalized financial insights.',
      tech: ['Python', 'React', 'FastAPI', 'AI Agents', 'Machine Learning', 'OpenRouter']
    }
  ];

  useEffect(() => {
    if (loading) return;

    const experiences = [
      {
        id: "groove-it",
        company: "GROOVE IT",
        role: "FULL STACK DEVELOPER",
        date: "29 JUNE 2026 — 6 MONTHS",
        location: "ONLINE",
        description: "Worked closely with the founding team to contribute to the development and enhancement of the platform.",
        responsibilities: [
          "PRODUCT DEVELOPMENT",
          "CLEAN & SCALABLE CODE",
          "TESTING & DEBUGGING",
          "FEATURE IMPLEMENTATION"
        ],
        impact: "Contributing to impactful Artist infrastructure through Groove It."
      }
    ];

    const ctx = gsap.context(() => {
      // Initial Load Reveal Animation
      const heroLines = gsap.utils.toArray('.hero-line');
      gsap.fromTo(heroLines,
        { y: '100%' },
        { y: '0%', duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo(scrollIndicatorRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 0.5, duration: 1, delay: 1 }
      );

      // Scroll-driven Hero transition
      gsap.to(headlineRef.current, {
        y: -150,
        autoAlpha: 0,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
          pinSpacing: false,
        },
      })

      gsap.to(scrollIndicatorRef.current, {
        autoAlpha: 0,
        y: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=30%',
          scrub: 1,
        }
      })

      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top top',
          end: '+=60%',
          scrub: 1,
          pin: true,
        },
      })

      const lines = gsap.utils.toArray(aboutDescRef.current.querySelectorAll('.line-text'))

      if (lines.length > 0) {
        aboutTl.fromTo(
          lines,
          { y: '100%', autoAlpha: 0 },
          { y: '0%', autoAlpha: 1, stagger: 0.12, ease: 'power3.out', duration: 1 }
        )
      }

      aboutTl.to({}, { duration: 0.2 }) // small pause at the end

      const projects = gsap.utils.toArray(workRef.current.querySelectorAll('.project-card'))
      if (projects.length > 0) {
        const workTl = gsap.timeline({
          scrollTrigger: {
            trigger: workRef.current,
            start: 'top top',
            end: `+=${projects.length * 100}%`,
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const totalTransitions = projects.length - 1;
              if (totalTransitions > 0) {
                const newIndex = Math.min(Math.floor(progress * totalTransitions + 0.5), totalTransitions);
                projects.forEach((p, i) => {
                  p.style.pointerEvents = i === newIndex ? 'auto' : 'none';
                });
              }
            }
          }
        })

        projects.forEach((project, index) => {
          if (index > 0) {
            gsap.set(project, { autoAlpha: 0, scale: 0.95, y: 50, zIndex: 0 })
          } else {
            gsap.set(project, { autoAlpha: 1, scale: 1, y: 0, zIndex: 1 })
          }
        })

        projects.forEach((project, index) => {
          if (index < projects.length - 1) {
            const nextProject = projects[index + 1]

            workTl
              .to(project, {
                y: -50,
                autoAlpha: 0,
                scale: 1.05,
                zIndex: 0,
                ease: 'power2.inOut',
                duration: 1
              })
              .to(nextProject, {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                zIndex: 1,
                ease: 'power2.inOut',
                duration: 1
              })
          }
        })

        // Add a small pause at the end so cards settle before the section unpins
        workTl.to({}, { duration: 0.5 })
      }

      const graphWrapper = experimentsRef.current ? experimentsRef.current.querySelector('.graph-wrapper') : null;
      if (graphWrapper) {
        const expTl = gsap.timeline({
          scrollTrigger: {
            trigger: experimentsRef.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: true
          }
        });
        
        expTl.fromTo(graphWrapper,
          { autoAlpha: 0, scale: 0.95 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
        expTl.to({}, { duration: 0.5 }); // Keep pinned while user plays
      }

      if (impactStatementRef.current && impactStatementDescRef.current) {
        const statementTl = gsap.timeline({
          scrollTrigger: {
            trigger: impactStatementRef.current,
            start: 'top top',
            end: '+=60%',
            scrub: 1,
            pin: true,
          },
        });

        const lines = gsap.utils.toArray(impactStatementDescRef.current.querySelectorAll('.line-text'));

        if (lines.length > 0) {
          statementTl.fromTo(
            lines,
            { y: '100%', autoAlpha: 0 },
            { y: '0%', autoAlpha: 1, stagger: 0.12, ease: 'power3.out', duration: 1 }
          );
        }

        statementTl.to({}, { duration: 0.2 });
      }

      if (impactPointsRef.current) {
        const pointsTl = gsap.timeline({
          scrollTrigger: {
            trigger: impactPointsRef.current,
            start: 'top top',
            end: '+=100%',
            scrub: 1,
            pin: true,
          }
        });

        const items = gsap.utils.toArray(impactPointsRef.current.querySelectorAll('.impact-item'));
        
        if (items.length > 0) {
          pointsTl.fromTo(
            items,
            { y: '100%', autoAlpha: 0 },
            { y: '0%', autoAlpha: 1, stagger: 0.2, ease: 'power3.out', duration: 1 }
          );
        }

        pointsTl.to({}, { duration: 0.3 });
      }

      if (experienceRef.current) {
        const experienceCards = gsap.utils.toArray('.experience-card')
        const expTl = gsap.timeline({
          scrollTrigger: {
            trigger: experienceRef.current,
            start: 'top top',
            end: `+=${experiences.length * 100}%`,
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const totalTransitions = experiences.length - 1;
              if (totalTransitions > 0) {
                const newIndex = Math.min(Math.floor(progress * totalTransitions + 0.5), totalTransitions);
                experienceCards.forEach((c, i) => {
                  c.style.pointerEvents = i === newIndex ? 'auto' : 'none';
                });
              }
            }
          }
        });

        experienceCards.forEach((card, index) => {
          if (index > 0) {
            gsap.set(card, { autoAlpha: 0, scale: 0.95, y: 50, zIndex: 0 })
          } else {
            gsap.set(card, { autoAlpha: 1, scale: 1, y: 0, zIndex: 1 })
          }
        })

        experienceCards.forEach((card, index) => {
          if (index < experienceCards.length - 1) {
            const nextCard = experienceCards[index + 1]

            expTl
              .to(card, {
                y: -50,
                autoAlpha: 0,
                scale: 1.05,
                zIndex: 0,
                ease: 'power2.inOut',
                duration: 1
              })
              .to(nextCard, {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                zIndex: 1,
                ease: 'power2.inOut',
                duration: 1
              })
          }
        })
        
        expTl.to({}, { duration: 0.5 });
      }

      if (skillsRef.current) {
        const skillsTl = gsap.timeline({
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top top',
            end: '+=150%',
            scrub: 1,
            pin: true,
          }
        });

        const categories = gsap.utils.toArray(skillsRef.current.querySelectorAll('.skill-category'));
        
        if (categories.length > 0) {
          skillsTl.fromTo(
            categories,
            { y: '100%', autoAlpha: 0 },
            { y: '0%', autoAlpha: 1, stagger: 0.2, ease: 'power3.out', duration: 1 }
          );
        }

        skillsTl.to({}, { duration: 0.3 });
      }

      if (hackathonsRef.current) {
        const hackathonCards = gsap.utils.toArray('.hackathon-card')
        const hackathonsTl = gsap.timeline({
          scrollTrigger: {
            trigger: hackathonsRef.current,
            start: 'top top',
            end: `+=${hackathonsData.length * 100}%`,
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const totalTransitions = hackathonsData.length - 1;
              if (totalTransitions > 0) {
                const newIndex = Math.min(Math.floor(progress * totalTransitions + 0.5), totalTransitions);
                hackathonCards.forEach((c, i) => {
                  c.style.pointerEvents = i === newIndex ? 'auto' : 'none';
                });
              }
            }
          }
        });

        hackathonCards.forEach((card, index) => {
          if (index > 0) {
            gsap.set(card, { autoAlpha: 0, scale: 0.95, y: 50, zIndex: 0 })
          } else {
            gsap.set(card, { autoAlpha: 1, scale: 1, y: 0, zIndex: 1 })
          }
        })

        hackathonCards.forEach((card, index) => {
          if (index < hackathonCards.length - 1) {
            const nextCard = hackathonCards[index + 1]

            hackathonsTl
              .to(card, {
                y: -50,
                autoAlpha: 0,
                scale: 1.05,
                zIndex: 0,
                ease: 'power2.inOut',
                duration: 1
              })
              .to(nextCard, {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                zIndex: 1,
                ease: 'power2.inOut',
                duration: 1
              })
          }
        })
        
        hackathonsTl.to({}, { duration: 0.5 });
      }

      if (contactRef.current) {
        const lines = contactRef.current.querySelectorAll('.contact-reveal-line')
        const links = contactRef.current.querySelectorAll('.contact-link-wrapper')

        const contactTl = gsap.timeline({
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 75%',
          }
        });

        if (lines.length > 0) {
          contactTl.fromTo(lines, 
            { y: '100%', autoAlpha: 0 }, 
            { y: '0%', autoAlpha: 1, stagger: 0.1, duration: 1, ease: 'power3.out' }
          );
        }
        
        if (links.length > 0) {
          contactTl.fromTo(links,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
            "-=0.5"
          );
        }
      }
    })

    // Force ScrollTrigger to recalculate pin positions now that everything is initialized
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => ctx.revert()
  }, [loading, projectsData])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Keep Lenis and GSAP ScrollTrigger on the same scroll clock.
    const onLenisScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onLenisScroll)

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onLenisScroll)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="portfolio">
      <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '2.5rem 4vw', zIndex: 100, display: 'flex', justifyContent: 'space-between', mixBlendMode: 'difference' }}>
        <div className="text-regular" style={{ fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Aditya</div>
        <div className="text-regular" style={{ opacity: 0.7 }}>AI SYSTEMS BUILDER</div>
      </nav>
      <main className="container">

        {/* 1. Hero */}
        <section ref={heroRef} className="section section-hero">
          <h1 ref={headlineRef} className="heading-jumbo mb-4" style={{ display: 'flex', flexDirection: 'column', marginTop: '12vh' }}>
            <div style={{ overflow: 'hidden' }}>
              <div className="hero-line">AI Systems</div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="hero-line">Builder<span className="accent-text">.</span></div>
            </div>
          </h1>

          <div ref={scrollIndicatorRef} style={{ position: 'absolute', bottom: '8vh', left: '4vw' }}>
            <span className="text-regular" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll to explore ↓</span>
          </div>
        </section>

        {/* 2. About */}
        <section ref={aboutRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--bg-color)', position: 'relative', zIndex: 10 }}>
          <div ref={aboutDescRef} style={{ width: '100%', maxWidth: '1400px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* Primary statement */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>

              <div style={{ overflow: 'hidden' }}>
                <p className="line-text" style={{fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: 400, margin: 0}}>I'm Aditya Dugar, a Software Engineering</p>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <p className="line-text" style={{fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: 400, margin: 0}}>student at Jain University. I build</p>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <p className="line-text" style={{fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: 400, margin: 0}}><span className="accent-text">AI-powered systems</span>, <span className="accent-text">intelligent automation</span>,</p>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <p className="line-text" style={{fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: 400, margin: 0}}>and modern web experiences.</p>
              </div>

            </div>

            {/* Secondary statement */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>

              <div style={{ overflow: 'hidden' }}>
                <p className="line-text" style={{fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: '1.6', fontWeight: 300, opacity: 0.8,maxWidth: '800px',margin: 0}}>From RAG agents and computer vision to</p>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <p className="line-text" style={{fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: '1.6', fontWeight: 300, opacity: 0.8,maxWidth: '800px',margin: 0}}>automation pipelines and full-stack products,</p>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <p className="line-text" style={{fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: '1.6', fontWeight: 300, opacity: 0.8,maxWidth: '800px',margin: 0}}>I learn by building and turning ideas into working software.</p>
              </div>

            </div>

          </div>
        </section>

        {/* 3. Selected Work */}
        <section ref={workRef} className="section" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="heading-large mb-12">Selected Work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', flexGrow: 1, alignItems: 'center' }}>
            {loading && <div className="text-regular" style={{ textAlign: 'center', opacity: 0.5 }}>Loading projects...</div>}
            {!loading && projectsData.map((project, index) => (
              <a
                key={project.originalId || project.id}
                className="project-card"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  if (project.github) {
                    window.open(project.github, "_blank", "noopener,noreferrer");
                  }
                }}
                style={{ gridColumn: '1 / 2', gridRow: '1 / 2', width: '100%', textDecoration: 'none', color: 'inherit' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = (e.clientX - rect.left) / rect.width - 0.5
                  const y = (e.clientY - rect.top) / rect.height - 0.5
                  e.currentTarget.style.setProperty('--mouse-x', x)
                  e.currentTarget.style.setProperty('--mouse-y', y)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', 0)
                  e.currentTarget.style.setProperty('--mouse-y', 0)
                }}
              >
                <div className="project-card-inner">
                  <div className="project-image">
                    <div className="project-preview-wrapper" style={{ pointerEvents: 'none' }}>
                      <div className="project-preview" style={{ backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ProjectVisual project={project} />
                      </div>
                    </div>
                    <span className="project-number">0{index + 1}</span>
                  </div>
                  <div className="project-info">
                    <div className="text-regular accent-text mb-2" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {project.category}
                    </div>
                    <h3 className="project-title heading-medium">{project.title}</h3>
                    <p className="project-desc text-regular">{project.description}</p>
                    <div className="project-tags">
                      {project.languages && project.languages.map(t => (
                        <span key={`lang-${t}`}>{t}</span>
                      ))}
                      {project.tech && project.tech.map(t => (
                        <span key={`tech-${t}`}>{t}</span>
                      ))}
                    </div>
                    <span
                      className="accent-text"
                      style={{ marginTop: '2.5rem', display: 'inline-block', fontWeight: 500, letterSpacing: '0.05em', fontSize: '1.125rem' }}
                    >
                      VIEW PROJECT ↗
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 4. Experiments */}
        <section ref={experimentsRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '10vh' }}>
          <div style={{ paddingLeft: '4vw', paddingRight: '4vw' }}>
            <h2 className="heading-large mb-4">Experiments</h2>
            <p className="text-regular mb-8" style={{ opacity: 0.7 }}>
              An evolving map of what I build, test, and explore. <br/>
              {!reposLoading && reposData.length > 0 ? `${reposData.length} public repositories represented.` : 'Loading network...'}
            </p>
          </div>
          <div className="graph-wrapper" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {!reposLoading && reposData.length > 0 && (
              <RepoGraph repos={reposData} />
            )}
          </div>
        </section>

        {/* 4.5. Impact */}
        {/* 4.5. Impact Statement */}
        <section ref={impactStatementRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--bg-color)', position: 'relative', zIndex: 10 }}>
          <div ref={impactStatementDescRef} style={{ width: '100%', maxWidth: '1400px', display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '4vw', paddingRight: '4vw' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ overflow: 'hidden' }}>
                <p className="line-text heading-large" style={{ lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>I BUILD SYSTEMS THAT TURN</p>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p className="line-text heading-large" style={{ lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}><span className="accent-text" style={{ fontStyle: 'italic' }}>COMPLEX</span> PROBLEMS INTO</p>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p className="line-text heading-large" style={{ lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>USEFUL SOFTWARE.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4.6. Impact Points */}
        <section ref={impactPointsRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '4vw', paddingRight: '4vw', paddingTop: '10vh', paddingBottom: '10vh' }}>
          <div className="grid grid-cols-2" style={{ gap: '4rem 8rem' }}>
            <div style={{ overflow: 'hidden' }}>
              <div className="impact-item" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem' }}>
                <div style={{ fontSize: '1rem', letterSpacing: '0.05em', opacity: 0.6, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="accent-text">01</span> <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></span> AI SYSTEMS
                </div>
                <p className="text-large" style={{ fontWeight: 400, opacity: 0.9, fontSize: 'clamp(1.125rem, 2vw, 1.75rem)', lineHeight: '1.4' }}>
                  Building practical AI-powered systems, not just model demos.
                </p>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div className="impact-item" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem' }}>
                <div style={{ fontSize: '1rem', letterSpacing: '0.05em', opacity: 0.6, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="accent-text">02</span> <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></span> AUTOMATION
                </div>
                <p className="text-large" style={{ fontWeight: 400, opacity: 0.9, fontSize: 'clamp(1.125rem, 2vw, 1.75rem)', lineHeight: '1.4' }}>
                  Turning repetitive workflows into intelligent automated systems.
                </p>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div className="impact-item" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem' }}>
                <div style={{ fontSize: '1rem', letterSpacing: '0.05em', opacity: 0.6, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="accent-text">03</span> <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></span> REAL-WORLD PROBLEMS
                </div>
                <p className="text-large" style={{ fontWeight: 400, opacity: 0.9, fontSize: 'clamp(1.125rem, 2vw, 1.75rem)', lineHeight: '1.4' }}>
                  Applying software and AI to problems that have practical value.
                </p>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div className="impact-item" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem' }}>
                <div style={{ fontSize: '1rem', letterSpacing: '0.05em', opacity: 0.6, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="accent-text">04</span> <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></span> EXPERIMENTATION
                </div>
                <p className="text-large" style={{ fontWeight: 400, opacity: 0.9, fontSize: 'clamp(1.125rem, 2vw, 1.75rem)', lineHeight: '1.4' }}>
                  Constantly exploring new technologies, architectures, and ideas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4.7. Experience */}
        <section ref={experienceRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <h2 className="heading-large mb-12" style={{ paddingLeft: '4vw', paddingRight: '4vw', paddingTop: '10vh' }}>EXPERIENCE</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', flexGrow: 1, alignItems: 'center', paddingLeft: '4vw', paddingRight: '4vw', paddingBottom: '10vh' }}>
            {[
              {
                id: "groove-it",
                company: "GROOVE IT",
                role: "FULL STACK DEVELOPER",
                date: "29 JUNE 2026 — 6 MONTHS",
                location: "ONLINE",
                description: "Worked closely with the founding team to contribute to the development and enhancement of the platform.",
                responsibilities: [
                  "PRODUCT DEVELOPMENT",
                  "CLEAN & SCALABLE CODE",
                  "TESTING & DEBUGGING",
                  "FEATURE IMPLEMENTATION"
                ],
                impact: "Contributing to impactful Artist infrastructure through Groove It."
              }
            ].map((exp, index, arr) => (
              <div 
                key={exp.id} 
                className="experience-card"
                style={{ gridColumn: '1 / 2', gridRow: '1 / 2', width: '100%', maxWidth: '1200px', margin: '0 auto', pointerEvents: index === 0 ? 'auto' : 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 400, opacity: 0.9, letterSpacing: '0.02em', lineHeight: 1 }}>
                    {exp.company}
                  </div>
                  <div className="accent-text" style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>
                    0{index + 1} / 0{arr.length}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem', opacity: 0.8, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <span className="accent-text">{exp.role}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>{exp.date}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>{exp.location}</span>
                </div>

                <div style={{ maxWidth: '800px', marginBottom: '3rem' }}>
                  <p className="text-large" style={{ fontWeight: 300, opacity: 0.9, fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: '1.6', margin: 0 }}>
                    {exp.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 3rem', marginBottom: '3rem' }}>
                  {exp.responsibilities.map((resp, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', letterSpacing: '0.1em', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ width: '15px', height: '1px', background: 'var(--accent-color)' }}></span> {resp}
                    </div>
                  ))}
                </div>

                <div>
                  <p style={{ fontSize: '1rem', fontStyle: 'italic', opacity: 0.7, margin: 0 }}>
                    {exp.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4.8. Skills & Tools */}
        <section ref={skillsRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '4vw', paddingRight: '4vw', paddingTop: '15vh', paddingBottom: '15vh' }}>
          <h2 className="heading-large mb-12">SKILLS & TOOLS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem 2rem', maxWidth: '1400px', width: '100%' }}>
            
            <div style={{ overflow: 'hidden' }}>
              <div className="skill-category">
                <div className="accent-text" style={{ fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>LANGUAGES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', opacity: 0.9, fontWeight: 300 }}>
                  <span>Python</span>
                  <span>JavaScript</span>
                  <span>TypeScript</span>
                  <span>C</span>
                  <span>Java</span>
                </div>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div className="skill-category">
                <div className="accent-text" style={{ fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>AI / INTELLIGENCE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', opacity: 0.9, fontWeight: 300 }}>
                  <span>LLM Applications</span>
                  <span>RAG</span>
                  <span>AI Agents</span>
                  <span>Gemini</span>
                  <span>Ollama</span>
                </div>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div className="skill-category">
                <div className="accent-text" style={{ fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>AUTOMATION</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', opacity: 0.9, fontWeight: 300 }}>
                  <span>n8n</span>
                  <span>ComfyUI</span>
                  <span>Workflow Automation</span>
                </div>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div className="skill-category">
                <div className="accent-text" style={{ fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>WEB / BACKEND</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', opacity: 0.9, fontWeight: 300 }}>
                  <span>React</span>
                  <span>Next.js</span>
                  <span>FastAPI</span>
                  <span>Node.js</span>
                  <span>Tailwind CSS</span>
                </div>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div className="skill-category">
                <div className="accent-text" style={{ fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>DATA / INFRASTRUCTURE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', opacity: 0.9, fontWeight: 300 }}>
                  <span>PostgreSQL</span>
                  <span>Supabase</span>
                  <span>MongoDB</span>
                  <span>Docker</span>
                  <span>Linux</span>
                  <span>Git</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4.9. Hackathons */}
        <section ref={hackathonsRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <h2 className="heading-large mb-12" style={{ paddingLeft: '4vw', paddingRight: '4vw', paddingTop: '10vh' }}>HACKATHONS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', flexGrow: 1, alignItems: 'center', paddingLeft: '4vw', paddingRight: '4vw', paddingBottom: '10vh' }}>
            
            {hackathonsData.map((hackathon, index) => (
              <div 
                key={hackathon.id} 
                className="hackathon-card"
                style={{ gridColumn: '1 / 2', gridRow: '1 / 2', width: '100%', maxWidth: '1200px', margin: '0 auto', pointerEvents: index === 0 ? 'auto' : 'none' }}
              >
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  
                  <div>
                    <div className="accent-text" style={{ fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
                      {hackathon.event}
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 400, opacity: 0.9, letterSpacing: '0.05em', marginBottom: '1rem', minHeight: '3rem' }}>
                      {hackathon.name}
                    </div>
                    {hackathon.role && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', minHeight: '1rem' }}>
                        <span style={{ width: '15px', height: '1px', background: 'var(--accent-color)' }}></span> {hackathon.role}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-large" style={{ fontWeight: 300, opacity: 0.9, fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', lineHeight: '1.6', margin: '0 0 2rem 0', minHeight: '4rem' }}>
                      {hackathon.description}
                    </p>
                    {hackathon.tech && (
                      <div className="project-tags" style={{ marginTop: '1rem' }}>
                        {hackathon.tech.map((t, i) => (
                          <span key={`tech-${i}`}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}

          </div>
        </section>


        {/* 5. Contact */}
        <section ref={contactRef} className="section" style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          paddingLeft: '4vw', 
          paddingRight: '4vw',
          paddingBottom: '2rem'
        }}>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <h2 className="heading-large" style={{ lineHeight: '1.05', letterSpacing: '-0.02em', marginBottom: '4rem' }}>
              <div style={{ overflow: 'hidden' }}>
                <div className="contact-reveal-line">LET'S BUILD</div>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="contact-reveal-line"><span className="accent-text" style={{ fontStyle: 'italic' }}>SOMETHING</span></div>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="contact-reveal-line">USEFUL.</div>
              </div>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="contact-link-wrapper" style={{ width: 'fit-content' }}>
                <a href="mailto:adityadugar7@gmail.com" className="text-large contact-link">
                  <span>Email</span>
                  <span>↗</span>
                </a>
              </div>
              <div className="contact-link-wrapper" style={{ width: 'fit-content' }}>
                <a href="https://github.com/AdityaDugar11" target="_blank" rel="noopener noreferrer" className="text-large contact-link">
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              </div>
              <div className="contact-link-wrapper" style={{ width: 'fit-content' }}>
                <a href="https://linkedin.com/in/aditya-dugar-b95962219/" target="_blank" rel="noopener noreferrer" className="text-large contact-link">
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: 0.5,
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span>ADITYA DUGAR</span>
              <span>AI • AUTOMATION • SOFTWARE</span>
            </div>
            <div>
              <span>© 2026</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

export default App
