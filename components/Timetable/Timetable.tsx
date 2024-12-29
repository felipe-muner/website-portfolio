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
    <section className="overflow-x-auto bg-brand-background-2 lg:p-4 lg:container lg:mx-auto my-28 flex flex-col gap-12 text-white text-xl font-semibold">
      <p >Classes timetable</p>
      <table className="min-w-full table-fixed border-collapse border border-[#363636] text-center">
        <thead>
          <tr className="bg-brand-orange font-mulish">
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              &nbsp;
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Monday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Tuesday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Wednesday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Thursday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Friday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Saturday
            </th>
            <th className="p-4 w-24 text-sm text-white font-normal">
              Sunday
            </th>
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
                    'border border-[#363636] py-6 w-24 h-24 text-sm relative',
                    {
                      'bg-brand-background-1': day.type === 'dark',
                      'bg-brand-background-2': day.type !== 'dark',
                    }
                  )}
                >
                  {day.name ? (
                    <div className="group">
                      <h5 className="mb-[10px] text-lg font-semibold uppercase text-white text-opacity-10 group-hover:text-opacity-100 transition">
                        {day.name}
                      </h5>
                      <span className="text-xs text-white text-opacity-10 group-hover:text-brand-gray-medium transition">
                        {day.instructor}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] w-[188px] h-[1px] bg-[#363636]"></div>
                  )}
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
