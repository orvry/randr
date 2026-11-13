// **bold** becomes <strong>, [placeholder] gets a highlight so unfinished text is easy to spot
export function rich(text) {
  return text
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\])/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('[')) return <span key={i} className="todo">{part}</span>;
      return part;
    });
}
