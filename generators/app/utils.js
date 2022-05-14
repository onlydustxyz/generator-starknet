function formatArgs(args) {
  return args.join(", ");
}

function formatLines(lines) {
  return lines.join("\n");
}

module.exports = { formatArgs, formatLines };
