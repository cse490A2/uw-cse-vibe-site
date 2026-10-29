// Posted lectures, in order. The lectures page, the home page schedule, and
// the "This week" card all read from here, so a slides link changes in one place.

export interface Lecture {
  id: string; // "L01"
  title: string;
  summary: string;
  slides: string;
}

export const LECTURES: Lecture[] = [
  {
    id: "L01",
    title: "Intro + Prompt to App",
    summary:
      "Introduce the class, build your first end-to-end app, and examine how to steer and verify AI-assisted code.",
    slides:
      "https://docs.google.com/presentation/d/16ZMX6pdsYZ4Lg6H6id4uk08q6Jz5oo-FVB5WdPdLT7M/edit",
  },
  {
    id: "L02",
    title: "Coding on a Budget",
    summary:
      "Model choice as a hiring decision: capability, task fit, and total cost. The prompt-run-refine loop, practiced by hand.",
    slides:
      "https://docs.google.com/presentation/d/1iqTGRGrUnFfsmgqyFlBxS3rGX_II0UFEgVDaK0CHSVs/edit?slide=id.L02Bs00#slide=id.L02Bs00",
  },
  {
    id: "L03",
    title: "The Agent Harness",
    summary:
      "What turns a model into a coding agent: the loop, the tools, and the guardrails that make up the harness around it.",
    slides:
      "https://docs.google.com/presentation/d/1R2ktSuYlbWvSdiywPtwbfkMC26c0Ryu2lmHPlaTiYf0/edit?slide=id.F03s00#slide=id.F03s00",
  },
  {
    id: "L04",
    title: "Agent Steering",
    summary:
      "How to steer a coding agent: specs and checks it can run, plan mode, interrupting and rewinding, AGENTS.md, and skills.",
    slides:
      "https://docs.google.com/presentation/d/1q5D2FhbnWFfdcClw-giTbza4x0KNwpHFhFg1qgPWM-Y/edit?slide=id.F04s00#slide=id.F04s00",
  },
  {
    id: "L05",
    title: "MCP and Security",
    summary:
      "How MCP turns any app, from Blender to a robot, into a tool your agent can call, and how to keep it safe: permissions, hooks, the lethal trifecta, and sandboxes.",
    slides:
      "https://docs.google.com/presentation/d/1reJnpabQDyxkcu91-zWb1pDlSFMQ5shTBj_5BiKy2F0/edit?slide=id.F07s01#slide=id.F07s01",
  },
];

export function lecture(id: string): Lecture | undefined {
  return LECTURES.find((l) => l.id === id);
}
