export async function getProjectById(id: string) {
  // Replace with real DB query
  return {
    id,
    title: 'Mock Project',
    minimumBadge: 'Pro Talent',
    status: 'open',
  };
}

export async function getProjectBids(projectId: string) {
  // Replace with real DB query
  return [
    { id: 'b1', professionalId: 'p1', ratePerHour: 45 },
    { id: 'b2', professionalId: 'p2', ratePerHour: 60 }
  ];
}

export async function selectProjectWinner(projectId: string, professionalId: string) {
  // Replace with DB logic to mark a winner
  return {
    success: true,
    message: `Professional ${professionalId} selected for project ${projectId}`
  };
}
