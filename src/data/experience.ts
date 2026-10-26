// ─────────────────────────────────────────────────────────────────────────
// EXPERIENCE TIMELINE, sourced directly from the CV. To add a new role,
// add an object to this array (newest first).
// ─────────────────────────────────────────────────────────────────────────

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string; // use 'Present' for a role you still have
  location: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

export const experience: Role[] = [
  {
    company: 'ISKAAN Tech',
    title: 'Software Engineer, Flutter',
    start: 'Mar 2025',
    end: '2026',
    location: 'Lahore, Pakistan',
    summary:
      'Led the redesign of live client CRM apps and built a new SaaS product from scratch, owning the architecture, integrations, and release management.',
    highlights: [
      'Led the redesign and refactor of several cross-platform real estate CRM apps, upgrading Flutter SDK versions and cleaning up code quality along the way.',
      'Designed and built a new SaaS product from the ground up, handling the architecture setup and the API integrations with Dio.',
      'Set up state management with BLoC and Provider to keep the app logic scalable and easy to maintain.',
      'Used AI coding tools like Claude Code and Cursor, guided by careful prompt engineering, to move faster through implementation and spend more time on architecture and requirements.',
      'Built responsive UI screens straight from wireframes and design guidelines, keeping the experience consistent across Android and iOS.',
      'Managed deployments to the Play Store and TestFlight, and integrated Shorebird so releases could go out faster and safer.',
      'Worked in Agile teams: sprint planning, code reviews, and keeping the codebase healthy through testing and regular refactoring.',
    ],
    tech: ['Flutter', 'Dart', 'BLoC', 'Provider', 'Dio', 'Shorebird', 'Claude Code', 'Prompt Engineering'],
  },
  {
    company: 'Senarios Pvt Limited',
    title: 'Software Engineer, Flutter',
    start: 'Feb 2023',
    end: 'Mar 2025',
    location: 'Lahore, Pakistan',
    summary:
      'Moved deeper into architecture work: offline-first storage, server sync, and real-time messaging, while also integrating analytics and AI-driven chat.',
    highlights: [
      'Integrated RESTful APIs across several apps, improving both data flow and how users interacted with the app.',
      'Added Mixpanel analytics for better visibility into user tracking and engagement.',
      "Rebuilt the Buyer App's filters with BLoC, which made tour planning and scheduling between buyers and agents much smoother.",
      'Added Google and Facebook sign-in, REST API integrations, and real-time chat over MQTT.',
      'Built offline data storage and two-way contact sync between the server and local database, and polished the UI to match iOS conventions.',
      'Refactored tightly coupled code to improve both maintainability and performance.',
      'Integrated AI APIs to power chatbot functionality inside the Chat My Book app.',
      'Handled deployments to the Play Store and TestFlight to keep release cycles smooth.',
    ],
    tech: ['Flutter', 'BLoC', 'Provider', 'MQTT', 'REST APIs', 'Mixpanel', 'Offline Storage', 'AI APIs'],
  },
  {
    company: 'BJS Soft Solutions Pvt Limited',
    title: 'Software Engineer, Flutter',
    start: 'Jan 2022',
    end: 'Feb 2023',
    location: 'Lahore, Pakistan',
    summary:
      'Migrated legacy Windows systems to Flutter with native hardware integration, and led a small team building multi-role workforce apps.',
    highlights: [
      'Helped migrate legacy Windows products over to Flutter on Android, using Platform Channels to control hardware directly.',
      'Migrated the state management layer from GetX to BLoC for better modularity and easier maintenance.',
      'Built authentication flows and set up clean architecture (MVC) for the AR-enabled sales apps.',
      'Designed and integrated Dio-based API modules using an MVVM architecture for the task and workflow management apps.',
      'Worked on the Journey Planner and Task Assignment modules, wiring up real-time APIs to coordinate supervisors and workers.',
      'Built permission-based access control across Admin, Manager, Supervisor, and Worker roles, so each role only saw the data it should.',
      'Supported e-learning and certification-tracking features inside the workforce management apps.',
      'Led a small team of two developers, handling task allocation and code reviews.',
    ],
    tech: ['Flutter', 'Platform Channels', 'BLoC', 'GetX', 'MVC', 'MVVM', 'Dio'],
  },
];

export const education = {
  degree: 'BS (Hons.) Software Engineering',
  school: 'The University of Haripur',
  start: '2017',
  end: '2021',
};
