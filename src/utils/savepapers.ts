import { createObjectCsvWriter } from "csv-writer";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const baseDir = join(process.cwd(), "logs");
if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });

export async function logPapers(
  endpoint: string,
  query: string | undefined,
  papers: Array<{
    paperId?: string;
    title?: string;
    year?: number;
    authors?: { name: string }[];
    venue?: string;
    citationCount?: number;
    url?: string;
    abstract?: string;
  }>,
  opts: { append?: boolean; filePath?: string } = {}
) {
//   /* 1️⃣ build a unique filename */
//   const ts = new Date().toISOString().replace(/[:.]/g, "-"); // 2025-06-20T15-23-45-678Z
//   const safeQuery = (query ?? "noquery").replace(/[^\w-]+/g, "_").slice(0, 30);
//   const filePath = join(
//     baseDir,
//     `${endpoint}_${safeQuery}_${ts}.csv`
//   );

  /* 1️⃣ build or re-use a filename */
  const ts        = opts.filePath
                   ? opts.filePath.match(/\d{4}-\d{2}-\d{2}T.*\.csv/)![0]
                   : new Date().toISOString().replace(/[:.]/g, "-");
  const safeQuery = (query ?? "noquery").replace(/[^\w-]+/g, "_").slice(0, 30);
  const filePath  = opts.filePath ??
        join(baseDir, `${endpoint}_${safeQuery}_${ts}.csv`);

  /* 2️⃣ create a fresh writer for this call */
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    append: existsSync(filePath),
    header: [
      { id: "timestamp",  title: "timestamp"  },
      { id: "endpoint",   title: "endpoint"   },
      { id: "query",      title: "query"      },
      { id: "paperId",    title: "paperId"    },
      { id: "title",      title: "title"      },
      { id: "year",       title: "year"       },
      { id: "authors",    title: "authors"    },
      { id: "venue",      title: "venue"      },
      { id: "citations",  title: "citations"  },
      { id: "url",        title: "url"        },
      { id: "abstract",   title: "abstract"   },
    ],
  });

  /* 3️⃣ write records */
  await csvWriter.writeRecords(
    papers.map(p => ({
      timestamp : ts,
      endpoint,
      query     : query ?? "",
      paperId   : p.paperId ?? "",
      title     : p.title ?? "",
      year      : p.year ?? "",
      authors   : (p.authors ?? []).map(a => a.name).join("; "),
      venue     : p.venue ?? "",
      citations : p.citationCount ?? "",
      url       : p.url ?? "",
      abstract  : p.abstract ?? "",
    }))
  );

  // you might want to return the path for debugging
  return filePath;
}