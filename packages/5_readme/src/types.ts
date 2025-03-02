export interface GenerateReadmeOptions {
  targetDir: string;
  outputFile: string;
  extensions: string[];
  verbose: boolean;
}

export interface FileTask {
  filePath: string;
  analyzed: boolean;
  exports?: ModuleExports;
  implementation?: string;
  description?: string;
}

export interface ModuleExports {
  functions: string[];
  classes: string[];
  interfaces: string[];
  types: string[];
  variables: string[];
  default?: string;
}

export interface AnalysisResult {
  exports: ModuleExports;
  implementation: string;
  description: string;
}

export interface ReadmeStructure {
  projectOverview: string;
  coreFunctions: string;
  apiReference: string;
  developmentGuide: string;
}

export interface TaskCache {
  tasks: FileTask[];
  lastUpdated: string;
  targetDir: string;
}
