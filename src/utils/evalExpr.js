// small expression evaluator for trusted schema values
export function evalExpr(expr, ctx = {}) {
  if (expr === null || expr === undefined) return expr;
  if (typeof expr === "number" || typeof expr === "boolean") return expr;
  if (typeof expr !== "string") return expr;

  const trimmed = expr.trim();
  if (!isNaN(Number(trimmed))) return Number(trimmed);

  // Allowed context keys come from ctx (e.g. params, index)
  const argNames = Object.keys(ctx);
  const argVals = Object.values(ctx);

  // add Math helper
  argNames.push("Math");
  argVals.push(Math);

  const code = `return (${expr});`;
  try {
    const fn = new Function(...argNames, code);
    return fn(...argVals);
  } catch (err) {
    console.warn("evalExpr failed:", expr, err);
    return null;
  }
}
