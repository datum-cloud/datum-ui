export interface ModuleEntry {
  subpath: string
  source: string
  style?: string
}

export interface StyleEntry {
  subpath: string
  css: string
}

export type ManifestEntry = ModuleEntry | StyleEntry

export declare const manifest: ManifestEntry[]

export declare function entryKeyFor(subpath: string): string

export declare function buildPackageExports(): Record<string, Record<string, string>>

export declare function buildTsdownEntry(): Record<string, string>
