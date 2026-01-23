import { normalize } from './normalize';

export function buildRankingUID(params: {
  sport: string;
  event: string;
  entity: string; 
  source: string;
}): string {
  const sportCode = normalize(params.sport);
  const eventCode = normalize(params.event);
  const entityCode = normalize(params.entity);
  const sourceCode = normalize(params.source);

  return `${sportCode}::${eventCode}::${entityCode}::${sourceCode}`;
}
