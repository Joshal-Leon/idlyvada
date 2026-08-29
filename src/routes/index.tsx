import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, BookOpen, CalendarDays, Feather, ArrowDown } from "lucide-react";
import heroClouds from "../assets/hero-clouds.png";
import galleryLetter from "../assets/gallery-letter.png";
import galleryJournal from "../assets/gallery-journal.png";
import galleryPolaroids from "../assets/gallery-polaroids.png";
import { CustomCursor } from "@/components/CustomCursor";
import { Reveal } from "@/components/Reveal";

const imageModules = import.meta.glob("../images/*.{jpeg,jpg,png,webp}", { eager: true, import: "default" });
const allImages = Object.values(imageModules) as string[];

const imagePositions = [
  { style: { top: "15%", left: "8%", transform: "rotate(-8deg)" }, delay: 100 },
  { style: { top: "18%", right: "10%", transform: "rotate(6deg)" }, delay: 200 },
  { style: { top: "50%", left: "6%", transform: "rotate(12deg)" }, delay: 300 },
  { style: { top: "48%", right: "8%", transform: "rotate(-10deg)" }, delay: 400 },
  { style: { bottom: "16%", left: "24%", transform: "rotate(4deg)" }, delay: 500 },
];

export const Route = createFileRoute("/")({
  component: Index,
});

const sections = [
  { id: "hero", label: "Home" },
  { id: "story", label: "Story" },
  { id: "gallery", label: "Gallery" },
  { id: "dates", label: "Dates" },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    setSelectedImages(shuffled.slice(0, 5));
    setGalleryPreview(shuffled.slice(5, 8));
  }, []);

  useEffect(() => {
    if (!slideshowOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSlideshowOpen(false);
      if (e.key === "ArrowLeft") setActiveSlideIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
      if (e.key === "ArrowRight") setActiveSlideIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slideshowOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen">
      <CustomCursor />

      {/* Navigation */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-[#4a0e17] border-b border-[#5e121d] py-4 shadow-md transition-all duration-500"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          <button
            onClick={() => scrollTo("hero")}
            className="group flex items-center gap-2"
          >
            <Feather className="h-5 w-5 text-amber-200 transition-transform duration-500 group-hover:-rotate-12" />
            <span className="font-serif text-sm tracking-[0.3em] uppercase text-amber-50">
              IDLY-VADA DIARIES
            </span>
          </button>
          <div className="hidden items-center gap-1 md:flex">
            {sections.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`relative px-4 py-2 text-xs tracking-[0.25em] uppercase transition-colors duration-300 ${active === s.id ? "text-amber-200" : "text-neutral-300 hover:text-white"
                  }`}
              >
                {s.label}
                <span
                  className={`absolute left-1/2 bottom-1 h-px bg-amber-400 transition-all duration-500 -translate-x-1/2 ${active === s.id ? "w-6 opacity-100" : "w-0 opacity-0"
                    }`}
                />
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={heroClouds}
            alt="Ethereal clouds"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out"
            style={{
              opacity: 0.6,
              transform: `scale(1.1) translate(${mouse.x * -20}px, ${mouse.y * -20}px)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Scattered background images */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
          {selectedImages.map((src, idx) => {
            const pos = imagePositions[idx];
            if (!pos) return null;
            return (
              <div
                key={idx}
                className="absolute w-44 p-2 bg-[#4a0e17]/80 backdrop-blur-[2px] border border-[#5e121d]/60 rounded-lg shadow-2xl opacity-0 hover:opacity-100 hover:scale-105 transition-all duration-[600ms] ease-out pointer-events-auto cursor-pointer"
                style={{
                  ...pos.style,
                  transitionDelay: `${pos.delay}ms`,
                }}
              >
                <img
                  src={src}
                  alt="Floating memory"
                  className="w-full aspect-[3/4] object-cover rounded-md"
                />
              </div>
            );
          })}
        </div>
        <div
          className="relative z-10 flex flex-col items-center px-6 text-center"
          style={{ transform: `translate(${mouse.x * 8}px, ${mouse.y * 8}px)` }}
        >
          <Reveal>
            <p className="mb-6 text-base md:text-lg lg:text-xl tracking-[0.25em] uppercase text-primary/90 font-medium">
              1 Year of us being together...
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="font-serif text-5xl leading-tight text-foreground md:text-7xl lg:text-8xl">
              <span className="inline-block hover:text-primary transition-colors duration-500">LOTS MORE</span>
              <br />
              <span className="inline-block italic hover:text-primary transition-colors duration-500">TO GO!!</span>
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <button
              onClick={() => scrollTo("story")}
              className="group mt-10 flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-500 hover:text-foreground hover:border-primary hover:scale-110"
            >
              <ArrowDown className="h-4 w-4 animate-bounce group-hover:animate-none" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="relative px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="mb-3 text-xs tracking-[0.3em] uppercase text-primary">
                Origins
              </p>
              <h2 className="font-serif text-3xl text-foreground md:text-5xl">
                How It All Started?
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="mx-auto max-w-3xl">
              {/* Convo snippet */}
              <div className="mb-10 flex flex-col gap-4 max-w-md mx-auto">
                <div className="flex justify-start">
                  <div className="bg-[#4a0e17] text-amber-50 px-4 py-2 rounded-2xl rounded-bl-none text-sm shadow-md border border-[#5e121d]">
                    <span className="font-semibold block text-[10px] tracking-wider uppercase text-amber-300 mb-1">Him</span>
                    umm hi..
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-card text-foreground px-4 py-2 rounded-2xl rounded-br-none text-sm shadow-md border border-border">
                    <span className="font-semibold block text-[10px] tracking-wider uppercase text-primary mb-1">Her</span>
                    HI
                  </div>
                </div>
              </div>

              {/* Story text */}
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-center font-light whitespace-pre-line font-serif italic">
                Started off with this convo and damnnnnnnnnn who knew we would be very special to each other in the future at that time. The Hi later turned into a reason to text.. and text turned into a reason to have moreeee texts and then lead to meetups. And after all that morning meetups and getting to know each other, came the day 19 July 2025 where idly decided to tell vada how she feels just like that! (first random spike). She said and made vada confused and put him on spot (she wanted to let it off before her bday itseems). Even though idly said she didn't want a response, Vada said he'll let her know his response if given time. And thus Vada took a whole of 1 MONTH 1 DAY to say idly about how he felt about her. Things as of then were still little confusing and both didn't know what is this relationship that they have with each other, but.. FINALLLY on this day 30th August 2025 vada decides to finally ask his idly out (directly/indirectly hehe). Thus they become the better half of each other from thereafter. Muwewwewueheehehheheheheee
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="mb-3 text-xs tracking-[0.3em] uppercase text-primary">
                The Plate
              </p>
              <h2 className="font-serif text-3xl text-foreground md:text-5xl">
                The Gallery
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Memories that I'm glad I get to hold on to.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {galleryPreview.map((src, i) => (
              <Reveal key={i} delay={i * 200}>
                <div
                  onClick={() => {
                    const fullIndex = allImages.indexOf(src);
                    setActiveSlideIndex(fullIndex >= 0 ? fullIndex : 0);
                    setSlideshowOpen(true);
                  }}
                  data-cursor="hover"
                  className="group relative overflow-hidden rounded-lg bg-[#4a0e17]/10 p-3 cursor-pointer transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 border border-[#5e121d]/30"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-md">
                    <img
                      src={src}
                      alt={`Gallery item ${i}`}
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                setActiveSlideIndex(0);
                setSlideshowOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card hover:bg-card/80 text-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:border-primary cursor-pointer font-serif"
            >
              View More
            </button>
          </div>
        </div>

        {/* Dynamic Slideshow Overlay */}
        {slideshowOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">
            {/* Blurry dark background backdrop */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
              onClick={() => setSlideshowOpen(false)}
            />

            {/* Slideshow main content wrapper */}
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
              {/* Close Button */}
              <button
                onClick={() => setSlideshowOpen(false)}
                className="absolute -top-12 right-0 text-neutral-400 hover:text-white transition-colors text-xs tracking-widest uppercase font-mono py-2"
              >
                Close ✕
              </button>

              {/* Image Frame with Slideshow transition effect */}
              <div className="relative flex items-center justify-center w-full aspect-[4/3] max-h-[70vh] bg-neutral-950/80 rounded-xl overflow-hidden shadow-2xl border border-white/5 p-4 select-none">
                <img
                  src={allImages[activeSlideIndex]}
                  alt={`Memory ${activeSlideIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded transition-all duration-500 ease-in-out"
                />

                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlideIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-[#4a0e17] text-white rounded-full hover:scale-110 transition-all border border-white/10 select-none cursor-pointer"
                >
                  ❮
                </button>

                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlideIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-[#4a0e17] text-white rounded-full hover:scale-110 transition-all border border-white/10 select-none cursor-pointer"
                >
                  ❯
                </button>
              </div>

              {/* Slide Indicators / Info */}
              <div className="mt-6 text-center text-xs text-neutral-400 font-mono tracking-widest bg-black/40 px-4 py-2 rounded-full border border-white/5">
                {activeSlideIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Important Dates Section */}
      <section id="dates" className="relative px-6 py-32 md:px-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="mb-3 text-xs tracking-[0.3em] uppercase text-primary">
                Adventure Map
              </p>
              <h2 className="font-serif text-3xl text-foreground md:text-5xl">
                The Treasure Map
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Click on the marks (spots and crosses) to trace our special memories along the journey.
              </p>
            </div>
          </Reveal>

          {/* Map scroll container for smaller viewports */}
          <div className="w-full overflow-x-auto rounded-xl shadow-2xl border-4 border-[#3c2a1a]/85 p-2 bg-[#1a0f0a]">
            <div className="relative min-w-[850px] aspect-[1000/600] bg-[#eeddb3] rounded-lg border-2 border-[#5c4028]/40 overflow-hidden select-none p-1 font-serif">
              {/* Compass Rose Decoration */}
              <div className="absolute top-8 left-8 opacity-25 w-24 h-24 border border-dashed border-[#5c4028] rounded-full flex items-center justify-center pointer-events-none">
                <span className="text-[10px] absolute top-1 uppercase font-mono tracking-wider font-semibold text-[#5c4028]">N</span>
                <span className="text-[10px] absolute bottom-1 uppercase font-mono tracking-wider font-semibold text-[#5c4028]">S</span>
                <span className="text-[10px] absolute left-1 uppercase font-mono tracking-wider font-semibold text-[#5c4028]">W</span>
                <span className="text-[10px] absolute right-1 uppercase font-mono tracking-wider font-semibold text-[#5c4028]">E</span>
                <div className="w-px h-20 bg-[#5c4028] absolute transform rotate-45" />
                <div className="w-px h-20 bg-[#5c4028] absolute transform -rotate-45" />
                <div className="w-20 h-px bg-[#5c4028] absolute" />
                <div className="w-px h-20 bg-[#5c4028] absolute" />
              </div>

              {/* Decorative Map Title */}
              <div className="absolute bottom-8 right-8 opacity-20 pointer-events-none text-right">
                <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-[#5c4028]">Treasured Lands</h3>
                <p className="text-[10px] italic text-[#5c4028]">Est. July 2025</p>
              </div>

              {/* SVG Dashed Trail */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d={importantDates
                    .map((d, i) => {
                      const command = i === 0 ? "M" : "L";
                      return `${command} ${d.x * 10} ${d.y * 6}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#5c4028"
                  strokeWidth="2.5"
                  strokeDasharray="6,8"
                  className="opacity-45"
                />
              </svg>

              {/* Map Spots and Crosses */}
              {importantDates.map((item, idx) => {
                const isLast = idx === importantDates.length - 1;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDateIndex(idx)}
                    className="absolute group z-10 cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                    }}
                  >
                    {isLast ? (
                      /* Big Red Cross for final treasure */
                      <div className="relative flex items-center justify-center w-10 h-10 animate-pulse hover:scale-125 transition-transform duration-300">
                        <span className="absolute text-3xl font-extrabold text-red-700 leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">✕</span>
                      </div>
                    ) : (
                      /* Spots/Crosses for standard dates */
                      <div className="relative flex items-center justify-center w-7 h-7 hover:scale-125 transition-transform duration-300">
                        <span className="absolute text-lg font-bold text-[#5c4028] group-hover:text-red-700 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          {idx % 2 === 0 ? "✕" : "✛"}
                        </span>
                        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-[#5c4028]/10 text-[#5c4028] text-[9px] font-mono tracking-tighter px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          {item.date.split(",")[0]}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Popup block with date details */}
              {selectedDateIndex !== null && (
                (() => {
                  const activeDate = importantDates[selectedDateIndex];
                  return (
                    <div
                      className="absolute z-30 bg-[#fdf6e2] text-[#3c2a1a] border-4 border-[#5c4028] p-5 rounded-lg shadow-2xl w-80 max-w-sm pointer-events-auto select-text animate-fade-in"
                      style={{
                        top: activeDate.y > 50 ? `${activeDate.y - 46}%` : `${activeDate.y + 4}%`,
                        left: activeDate.x > 65 ? `${activeDate.x - 34}%` : activeDate.x < 15 ? `${activeDate.x + 2}%` : `${activeDate.x - 16}%`,
                      }}
                    >
                      <button
                        onClick={() => setSelectedDateIndex(null)}
                        className="absolute top-2 right-2 text-lg text-[#5c4028] hover:text-red-700 font-bold transition-colors cursor-pointer select-none"
                      >
                        ✕
                      </button>
                      <div className="font-mono text-[10px] tracking-widest uppercase text-amber-800 font-semibold border-b border-[#ebdcb9] pb-1">
                        {activeDate.date}
                      </div>
                      <h3 className="font-serif text-base font-bold text-[#2a1b10] mt-2">
                        {activeDate.title}
                      </h3>
                      <p className="font-serif italic text-xs mt-3 leading-relaxed whitespace-pre-line text-[#5c4028]/90">
                        {activeDate.description}
                      </p>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Feather className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs tracking-widest uppercase text-muted-foreground">
              IDLY-VADA DIARIES
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const importantDates = [
  {
    date: "July 10, 2025",
    title: "The Meetup",
    description: "Rainy day with both stuck under the same building.\nStarted off with Hi and ended up with embarrassment.",
    x: 8,
    y: 25
  },
  {
    date: "July 11, 2025",
    title: "The Parking Convo",
    description: "Talking stage? Nah it was forced talk under pressure.\nNonstop talk but did you notice? People on the Floor!",
    x: 14,
    y: 45
  },
  {
    date: "July 19, 2025",
    title: "Past Future PRESENT!",
    description: "Past no.. its fine. Future no.. its fine.\nPRESENT? UMMM AHHH WHAAAAAAAAAAT?!@#$ ",
    x: 22,
    y: 35
  },
  {
    date: "August 20, 2025",
    title: "What Randomly Huh?",
    description: "Proves that there's no such thing as good timing.\nAlways better when the person is caught off guard hehe.",
    x: 18,
    y: 65
  },
  {
    date: "August 30, 2025",
    title: "Start of the Chapter",
    description: "ummm yeh umm Direct? or Indirect?\nhaha lol ummm yeh. Statebank exclusive content shush.",
    x: 28,
    y: 72
  },
  {
    date: "September 30, 2025",
    title: "Random SuperPower?",
    description: "Expect the unexpected? \nNah it was more dangerous than that",
    x: 34,
    y: 55
  },
  {
    date: "November 20ish, 2025",
    title: "Come Back soon",
    description: "Who knew distance mattered a lot.\nIt is then you realise how much they mean to you.",
    x: 42,
    y: 40
  },
  {
    date: "December 30, 2025",
    title: "Best End of the Year",
    description: "Grub Monkeys was her new favorite spot for burgers.\nRiver view cannot beat her view though.",
    x: 46,
    y: 70
  },
  {
    date: "February 19, 2026",
    title: "Come back soon pt2",
    description: "Content? same as pt 1 \n#sadir #alone",
    x: 55,
    y: 65
  },
  {
    date: "March 14, 2026",
    title: "Blueberry Cheesecake",
    description: "Eyes just meet, background fades away, \nits just both of them, and magic happens",
    x: 58,
    y: 45
  },
  {
    date: "March 17, 2026",
    title: "HER HOMECOMING?",
    description: "Unexpected plan and boom all shy around\nyeh gurl stop following me in my own house ",
    x: 66,
    y: 30
  },
  {
    date: "March 19, 2026",
    title: "HIM HOMECOMING?",
    description: "Unexpected again, but undercover this time\nThere's pink flowers though which were pretty.",
    x: 76,
    y: 25
  },
  {
    date: "March 21, 2026",
    title: "Best Bday Ever!",
    description: "Nothing beats than spending time with the person you love the most\nGlad to have spent the birthday with her",
    x: 72,
    y: 50
  },
  {
    date: "May 6, 2026",
    title: "Some skills should never be revealed",
    description: "Who knew driving car was so difficult in gaming\nIll handle the Real one though",
    x: 64,
    y: 75
  },
  {
    date: "May 21, 2026",
    title: "Once a Princess, Always a Princess",
    description: "Bouquet of flowers makes her day and she loves accessories\nLily Oh Lily whos the Murderer?!",
    x: 71,
    y: 82
  },
  {
    date: "May 23, 2026",
    title: "MCA calling",
    description: "Mandatory meetup to have some distance factor play up\nMBC though was good. Especially the Blueberry and tiramisu.",
    x: 82,
    y: 72
  },
  {
    date: "July 18 and 19, 2026",
    title: "Pre Bdays she deserves",
    description: "Good luck is a thing, or else meetup at that time was impossible\nVery much Fun with all activities and penalties ",
    x: 88,
    y: 48
  }
];
