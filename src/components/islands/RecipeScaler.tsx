import { useState } from 'react';

export type Ingredient = {
  amount: number;
  unit: string;
  item: string;
  kcal?: number; // breakdown estimate, kept in source only — not rendered
};

type Props = {
  baseServings: number;
  servingUnit: string;
  kcalPerUnit?: number;
  ingredients: Ingredient[];
  showBreakdown?: boolean; // per-ingredient kcal column — detail page only
};

/** "cookies" → "cookie", "servings" → "serving". */
function singular(unit: string): string {
  return unit.endsWith('s') ? unit.slice(0, -1) : unit;
}

/** Format a scaled amount: whole numbers above 10, quarter precision below. */
function formatAmount(value: number): string {
  if (value >= 10) return String(Math.round(value));
  return String(Math.round(value * 4) / 4);
}

export default function RecipeScaler({
  baseServings,
  servingUnit,
  kcalPerUnit,
  ingredients,
  showBreakdown = false,
}: Props) {
  const step = Math.max(1, Math.round(baseServings / 4));
  const [servings, setServings] = useState(baseServings);
  const scale = servings / baseServings;

  const adjust = (dir: number) => setServings((s) => Math.max(step, s + dir * step));

  const hasKcal = ingredients.some((ing) => ing.kcal != null);
  const breakdown = showBreakdown && hasKcal;
  const totalKcal = ingredients.reduce((sum, ing) => sum + (ing.kcal ?? 0), 0);

  return (
    <>
      <div className="servings">
        <button onClick={() => adjust(-1)} aria-label={`Fewer ${servingUnit}`}>
          −
        </button>
        <span>
          makes <strong>{servings}</strong> {servingUnit}
        </span>
        <button onClick={() => adjust(1)} aria-label={`More ${servingUnit}`}>
          +
        </button>
        {kcalPerUnit != null && (
          <span className="kcal">
            ~{kcalPerUnit} kcal/{singular(servingUnit)}
          </span>
        )}
      </div>
      <table>
        <tbody>
          {ingredients.map((ing) => (
            <tr key={ing.item}>
              <td className="amount">
                {formatAmount(ing.amount * scale)} {ing.unit}
              </td>
              <td>{ing.item}</td>
              {breakdown && (
                <td className="kcal-cell">
                  {ing.kcal != null ? `${Math.round(ing.kcal * scale)} kcal` : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {breakdown && (
          <tfoot>
            <tr>
              <td className="amount" />
              <td>total</td>
              <td className="kcal-cell">~{Math.round(totalKcal * scale)} kcal</td>
            </tr>
          </tfoot>
        )}
      </table>
    </>
  );
}
