export interface ProjectMetrics {
  applications: number;
  services: number;
  sharedPackages: number;
  typescriptFiles: number;
  boundedContextModules: number;
  technologies: number;
  documentationPages: number;
  adrs: number;
}

export const PROJECT_METRICS: ProjectMetrics = {
  applications: 5,
  services: 6,
  sharedPackages: 8,
  typescriptFiles: 1262,
  boundedContextModules: 22,
  technologies: 24,
  documentationPages: 21,
  adrs: 7,
};

export const METRIC_LABELS: Record<keyof ProjectMetrics, string> = {
  applications: 'Applications',
  services: 'Backend services',
  sharedPackages: 'Shared packages',
  typescriptFiles: 'TypeScript files',
  boundedContextModules: 'Bounded-context modules',
  technologies: 'Core technologies',
  documentationPages: 'Engineering docs',
  adrs: 'Architecture decisions',
};
