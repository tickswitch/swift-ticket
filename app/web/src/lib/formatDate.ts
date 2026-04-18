// hooks/useDateFormat.ts
import { useMemo } from 'react';

export const useDateFormat = () => {
  const formatDate = useMemo(() => {
    return (dateString: string, timeString: string): string => {
      try {
        // Validate inputs
        if (!dateString || !timeString) {
          console.warn('Missing date or time string');
          return 'Date not available';
        }

        // Create date object from the strings
        const date = new Date(`${dateString}T${timeString}`);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid date format:', dateString, timeString);
          return 'Invalid date';
        }

        // Format to: "Fri, Nov 19, 2025, 8:00 PM"
        const formatter = new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        return formatter.format(date);
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Date format error';
      }
    };
  }, []);

  return { formatDate };
};