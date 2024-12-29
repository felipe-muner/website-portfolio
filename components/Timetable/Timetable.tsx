import { cn } from '@/lib/utils';
import React from 'react';

const Timetable = () => {
  const timetable = [
    {
      time: '6.00am - 8.00am',
      days: [
        { name: 'WEIGHT LOOSE', instructor: 'RLefew D. Loee', type: 'dark' },
        { name: 'Cardio', instructor: 'RLefew D. Loee' },
        { name: 'Yoga', instructor: 'Keaf Shen', type: 'dark' },
        { name: 'Fitness', instructor: 'Kimberly Stone' },
        {},
        { name: 'Boxing', instructor: 'Rachel Adam' },
        { name: 'Body Building', instructor: 'Robert Cage', type: 'dark' },
      ],
    },
    {
      time: '10.00am - 12.00am',
      days: [
        {},
        { name: 'Fitness', instructor: 'Kimberly Stone', type: 'dark' },
        { name: 'WEIGHT LOOSE', instructor: 'RLefew D. Loee' },
        { name: 'Cardio', instructor: 'RLefew D. Loee', type: 'dark' },
        { name: 'Body Building', instructor: 'Robert Cage' },
        { name: 'Karate', instructor: 'Donald Grey', type: 'dark' },
        {},
      ],
    },
    {
      time: '5.00pm - 7.00pm',
      days: [
        { name: 'Boxing', instructor: 'Rachel Adam', type: 'dark' },
        { name: 'Karate', instructor: 'Donald Grey' },
        { name: 'Body Building', instructor: 'Robert Cage', type: 'dark' },
        {},
        { name: 'Yoga', instructor: 'Keaf Shen', type: 'dark' },
        { name: 'Cardio', instructor: 'RLefew D. Loee' },
        { name: 'Fitness', instructor: 'Kimberly Stone', type: 'dark' },
      ],
    },
    {
      time: '7.00pm - 9.00pm',
      days: [
        { name: 'Cardio', instructor: 'RLefew D. Loee' },
        {},
        { name: 'Boxing', instructor: 'Rachel Adam' },
        { name: 'Yoga', instructor: 'Keaf Shen', type: 'dark' },
        { name: 'Karate', instructor: 'Donald Grey' },
        { name: 'Boxing', instructor: 'Rachel Adam', type: 'dark' },
        { name: 'WEIGHT LOOSE', instructor: 'RLefew D. Loee' },
      ],
    },
  ];

  return (
    <section className="overflow-x-auto bg-brand-background-2 lg:p-4 lg:container lg:mx-auto my-28">
      <table className="min-w-full border-collapse border border-[#363636] text-center">
        <thead>
          <tr className="bg-brand-orange font-mulish">
            <th className="p-4 text-sm text-white border-r border-brand-gray-darker font-normal">&nbsp;</th>
            <th className="p-4 text-sm text-white border-r border-brand-gray-darker font-normal">Monday</th>
            <th className="p-4 text-sm text-white border-r border-brand-gray-darker font-normal">Tuesday</th>
            <th className="p-4 text-sm text-white border-r border-brand-gray-darker font-normal">Wednesday</th>
            <th className="p-4 text-sm text-white border-r border-brand-gray-darker font-normal">Thursday</th>
            <th className="p-4 text-sm text-white border-r border-brand-gray-darker font-normal">Friday</th>
            <th className="p-4 text-sm text-white border-r border-brand-gray-darker font-normal">Saturday</th>
            <th className="p-4 text-sm text-white">Sunday</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-[#363636] bg-brand-black p-4 w-24 h-24 text-brand-orange font-mulish text-xs">
                {row.time}
              </td>
              {row.days.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={cn(
                    'border border-[#363636] lg:py-8 md:py-6 py-4 w-24 h-24 text-sm',
                    {
                      'bg-brand-background-1': day.type === 'dark',
                      'bg-brand-background-2': day.type !== 'dark'
                    }
                  )}
                >
                  {day.name ? (
                    <div>
                      <h5 className="mb-3 text-lg font-semibold uppercase text-white">
                        {day.name}
                      </h5>
                      <span className="text-xs text-brand-gray-medium font-mulish">
                        {day.instructor}
                      </span>
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Timetable;
