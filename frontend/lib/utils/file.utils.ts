export function getResumeViewerUrl(url: string): string {
  if (!url || typeof url !== "string") return "#"
  const path = url.split("?")[0].toLowerCase()
  if (path.endsWith(".doc") || path.endsWith(".docx")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`
  }
  return url
}

export function getResumeDownloadUrl(url: string, firstName: string, lastName: string): string {
  if (!url || typeof url !== "string") return "#"
  const path = url.split("?")[0]
  const ext = path.split(".").pop() ?? "pdf"
  const filename = `resume_${firstName}_${lastName}.${ext}`
  return `${path}?download=${encodeURIComponent(filename)}`
}
