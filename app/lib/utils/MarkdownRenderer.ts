import markdownit from 'markdown-it';
import hljs from 'highlight.js'
import { katex } from "@mdit/plugin-katex";

// Actual default values
const md = markdownit({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
}).use(katex);

class MarkdownRenderer {
    md: markdownit;

    constructor() {
        this.md = md;
    }


    render(markdown: string): string {
        return this.md.render(markdown);
    }
}

export { MarkdownRenderer };