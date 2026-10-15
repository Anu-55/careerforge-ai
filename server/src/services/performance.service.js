import Interview from '../models/Interview.model.js';

export const getUserPerformance = async (userId) => {
  const interviews = await Interview.find({
    userId,
    status: 'completed',
    feedback: { $ne: null },
  })
    .select('feedback overallScore createdAt role')
    .sort({ createdAt: -1 });

  if (interviews.length === 0) {
    return {
      hasData: false,
      totalInterviews: 0,
      readinessScore: 0,
      skills: {
        communicationSkills: 0,
        technicalKnowledge: 0,
        problemSolving: 0,
        codeQuality: 0,
        confidence: 0,
      },
      strongestSkill: null,
      improvementArea: null,
      recentTrend: 0,
    };
  }

  const skillTotals = {
    communicationSkills: 0,
    technicalKnowledge: 0,
    problemSolving: 0,
    codeQuality: 0,
    confidence: 0,
  };

  let validInterviewCount = 0;

  for (const interview of interviews) {
    const scores = interview.feedback?.categoryScores;

    if (!scores) continue;

    skillTotals.communicationSkills +=
      scores.communicationSkills?.score || 0;

    skillTotals.technicalKnowledge +=
      scores.technicalKnowledge?.score || 0;

    skillTotals.problemSolving +=
      scores.problemSolving?.score || 0;

    skillTotals.codeQuality +=
      scores.codeQuality?.score || 0;

    skillTotals.confidence +=
      scores.confidence?.score || 0;

    validInterviewCount++;
  }

  const count = validInterviewCount || 1;

  const skills = {
    communicationSkills: Math.round(
      skillTotals.communicationSkills / count
    ),

    technicalKnowledge: Math.round(
      skillTotals.technicalKnowledge / count
    ),

    problemSolving: Math.round(
      skillTotals.problemSolving / count
    ),

    codeQuality: Math.round(
      skillTotals.codeQuality / count
    ),

    confidence: Math.round(
      skillTotals.confidence / count
    ),
  };

  const readinessScore = Math.round(
    Object.values(skills).reduce((sum, score) => sum + score, 0) / 5
  );

  const skillEntries = Object.entries(skills);

  const strongestSkill = skillEntries.reduce(
    (best, current) =>
      current[1] > best[1] ? current : best
  );

  const improvementArea = skillEntries.reduce(
    (lowest, current) =>
      current[1] < lowest[1] ? current : lowest
  );

  let recentTrend = 0;

  if (interviews.length >= 2) {
    const latest = interviews[0].overallScore || 0;
    const previous = interviews[1].overallScore || 0;

    recentTrend = latest - previous;
  }

  return {
    hasData: true,
    totalInterviews: interviews.length,
    readinessScore,
    skills,
    strongestSkill: {
      name: strongestSkill[0],
      score: strongestSkill[1],
    },
    improvementArea: {
      name: improvementArea[0],
      score: improvementArea[1],
    },
    recentTrend,
  };
};