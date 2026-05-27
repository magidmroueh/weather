import { recommend } from '~/server/recommend';
import type { RecommendationRequest, RecommendationResponse } from '@weather/shared';

export async function getRecommendation(
  req: RecommendationRequest,
): Promise<RecommendationResponse> {
  return recommend({ data: req });
}
