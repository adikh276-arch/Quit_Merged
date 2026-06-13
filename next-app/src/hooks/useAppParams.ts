"use client";
import { useParams } from "next/navigation";

export function useAppParams() {
  const params = useParams();
  
  const slug = params?.slug as string | undefined;
  const catchAll = (params?.catchAll as string[]) || [];
  
  let trackerId, toolId, contentId, substep, step;
  
  if (catchAll[0] === 'tracker') {
    trackerId = catchAll[1];
  } else if (catchAll[0] === 'tool') {
    toolId = catchAll[1];
    contentId = catchAll[2];
    substep = catchAll[3];
  } else if (catchAll[0] === 'onboarding') {
    step = catchAll[1];
  }
  
  return { slug, trackerId, toolId, contentId, substep, step };
}
