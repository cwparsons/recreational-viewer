// Utility to format the occurrence description for the mobile row title
export function formatOccurrenceDescription(
  eventName: string,
  occurrenceMinStartDate: Date,
  occurrenceDescription: string,
): string {
  let occurs = occurrenceDescription;
  if (occurs === 'Every Mon, Tue, Wed, Thu, Fri') {
    occurs = 'Every weekday';
  } else {
    // Handle consecutive days
    const match = occurs.match(
      /^Every ((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:, (?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))+)/,
    );
    if (match) {
      const days = match[1].split(', ');
      const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const indices = days.map((d) => dayOrder.indexOf(d)).sort((a, b) => a - b);
      // Check if all days are consecutive
      let isConsecutive = true;
      for (let i = 1; i < indices.length; i++) {
        if (indices[i] !== indices[i - 1] + 1) {
          isConsecutive = false;
          break;
        }
      }
      if (isConsecutive && indices.length > 1) {
        occurs = `Every ${dayOrder[indices[0]]} - ${dayOrder[indices[indices.length - 1]]}`;
      }
    }
  }
  return `${eventName} (starts ${occurrenceMinStartDate.toLocaleString('default', { month: 'long' })}, ${occurs.replace('Every', 'every')})`;
}
