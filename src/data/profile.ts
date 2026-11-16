export const profile = {
  name: 'Marlee Severson',
  role: 'Game programmer',
  tagline: 'I write the code underneath the boss fight.',
  intro:
    'Game programmer building gameplay systems, boss encounters, enemy AI, and client-server architecture in Unity and Roblox. Two award-winning games. Looking for a summer 2027 game programming internship.',
  location: 'Menomonie, Wisconsin',
  education: {
    school: 'University of Wisconsin–Stout',
    degree: 'B.S. Computer Science',
    graduation: 'May 2028',
    graduationShort: "'28",
  },
  seeking: 'Summer 2027 game programming internship',
  email: 'marleeseverson13@gmail.com',
  site: 'https://marleeseverson.com',
  links: {
    github: 'https://github.com/marleeseverson',
    itch: 'https://catlovermax13.itch.io',
    linkedin: 'https://www.linkedin.com/in/marlee-severson-b54680332',
  },
  /**
   * Resume. The site ships a print-ready resume page at /resume.html built from this data.
   * To link a PDF instead, drop it into public/ and set `resumePdf` to its path (e.g. '/Marlee-Severson-Resume.pdf').
   */
  resumePage: '/resume.html',
  resumePdf: null as string | null,
  experience: [
    {
      title: 'Data Annotator',
      org: 'Handshake AI',
      summary:
        'Evaluate AI-generated responses, particularly code, for correctness, quality, and clarity. Reading other people’s code critically all day sharpens my own.',
    },
  ],
  about: [
    'I’m a Computer Science student at UW–Stout who makes games. I care about the part of a game you can’t see: the state machines, timing windows, and attack patterns that make a boss feel dangerous and a hit feel earned.',
    'On team projects I take ownership of the technical side so artists and designers can focus on their craft. On solo projects I ship complete games under jam deadlines, including one that took first place out of 75 teams.',
  ],
} as const;

export const resumeHref = profile.resumePdf ?? profile.resumePage;
