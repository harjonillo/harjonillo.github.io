import { useState } from 'react';

export type Ingredient = { amount: number; unit: string; item: string };

type Props = {
  baseServings: number;
  servingUnit: string;
  ingredients: Ingredient[];
};

/** Format a scaled amount: whole numbers above 10, quarter precision below. */
function formatAmount(value: number): string {
  if (value >= 10) return String(Math.round(value));
  return String(Math.round(value * 4) / 4);
}

export default function RecipeScaler({ baseServings, servingUnit, ingredients }: Props) {
  const step = Math.max(1, Math.round(baseServings / 4));
  const [servings, setServings] = useState(baseServings);
  const scale = servings / baseServings;

  const adjust = (dir: number) => setServings((s) => Math.max(step, s + dir * step));

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
      </div>
      <table>
        <tbody>
          {ingredients.map((ing) => (
            <tr key={ing.item}>
              <td className="amount">
                {formatAmount(ing.amount * scale)} {ing.unit}
              </td>
              <td>{ing.item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
